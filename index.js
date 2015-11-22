var Github = require('github-api');
var async = require('async');
var _ = require('underscore');

var github;

module.exports = function (auth){
  github = new Github(auth);
  return {
    getByUser: function getByUser(userName, cb) {
      getPackagesRanking(userName, cb);
    }
  }
};

//-------------------------------------------------------------------------------

function getPackagesRanking(userName, cb){
  getDependenciesList(userName, function(err, dependencies){
    if(err){
      return cb(err.request ? err.request.responseText : err);
    }
  	var result = _.chain(dependencies)
  	.flatten()
  	.groupBy()
  	.map(function(dependenciesList){
  		return {name: dependenciesList[0], rank: dependenciesList.length};
  	})
  	.sortBy('rank')
  	.reverse()
  	.values()._wrapped;
    cb(false, result);
  });
}


//---------------------------------------

function getDependenciesList(userName, cb){
	getRepos(userName, function(err, repos){
		if(err){
			return cb(err);
		}
		var requestCallbacks = _.map(repos, function(repo){
			return function(cb){
				getDependanciesByRepo(repo, function(err, dependencies){
					cb(false, dependencies || []);
				});
			};
		});
		async.parallel(requestCallbacks, function(err, resp){
			cb(false, resp);
		});
	});
}

function getRepos(userName, cb){
	var user = github.getUser();
  user.userRepos(userName, function(err, repos) {
		if(err){
			return cb(err);
		}
		var repoNames = _.pluck(repos, 'name');
		var repoInstances = _.map(repoNames, function(repoName){
			var repo = github.getRepo(userName, repoName);
			repo.name = repoName;
			return repo;
		});
		cb(false, repoInstances);
	});
};


function getDependanciesByRepo(repo, cb){
	repo.contents('master', "package.json", function(err, contents) {
		if(err){
			return cb(err);
		}
		var content = (new Buffer(contents.content, 'base64')).toString();
		try{
			var packageJSONObject = JSON.parse(content);
			cb(false, getDependanciesByPackageJSONObject(packageJSONObject));
		}catch(err){
			return cb(err);
		}
	});
}

function getDependanciesByPackageJSONObject(packageJSONObject){
	var devDependencies = packageJSONObject.devDependencies || {};
	var dependencies = packageJSONObject.dependencies || {};
	return _.keys(devDependencies).concat(_.keys(dependencies));
}
