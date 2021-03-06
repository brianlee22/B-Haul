const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const assert = require('assert');

/**
 * Represents MongoDB data access object.
 * @constructor
 * @param {string} mongoUri - MongoDB URL to connect to.
 * @param {string} dbname - Database to use.
 */
function MongoDao(mongoUri, dbname) {
    var _this = this;
    var options = {
        useNewUrlParser: true
    };
    _this.mongoClient = new MongoClient(mongoUri, options);
    return new Promise(function(resolve, reject) {
        _this.mongoClient.connect(function(err, client) {
            assert.equal(err, null);
            console.log(" Successfully connected to mongo client! \n");
            _this.dbConnection = _this.mongoClient.db(dbname);
            resolve(_this);
        });
    });
}

/**
 * Read all documents from a collection
 * @param  {String} collectionName - Name of the collection to read from.
 * @return {Promise<Objects[]>} - Promise that resolves to a list of documents in the collection
 */
MongoDao.prototype.readCollection = function(collectionName) {
	let _this = this;
	return new Promise(function(resolve, reject) {
		_this.dbConnection.collection(collectionName).find().toArray((err, docs) => {
			if(err) {
				reject(err);
			} else {
				resolve(docs);
			}
		})
	});
}

/**
 * Print all documents from a collection that matches a filter
 * @param  {String} collectionName - Name of the collection to read from.
 * @param  {String} doc - Filter to use.
 */
MongoDao.prototype.printDocument = function(collectionName, doc) {
	let _this = this;
	return new Promise(function(resolve, reject) {
			_this.dbConnection.collection(collectionName).find({}).filter(doc).toArray(function(err, docs) {
				if(err) {
					reject(err);
				} else {
					console.log(docs[0]);
					console.log("\n");
					resolve();
				}	
		});
	});
}

/**
 * Inserts a document into a collection
 * @param  {String} collectionName - Name of the collection to insert into.
 * @return {Promise} - Promise that resolves when operation is done.
 */
MongoDao.prototype.insertDocument = function(collectionName, doc) {
	let _this = this;
	return new Promise(function(resolve, reject) {
		_this.dbConnection.collection(collectionName).insertOne(doc, function(err, result) {
			if(err) {
				reject(err);
			} else {
				console.log(" Document inserted successfully:");
				resolve();
			}			
		});
	});
}

/**
 * Updates all documents in a collection that matches a filter
 * @param  {String} collectionName - Name of the collection to update.
 * @param  {String} doc - Filter to use.
 * @param  {String} updateDocument - New document to replace with.
 * @return {Promise} - Promise that resolves when operation is done.
 */
MongoDao.prototype.updateDocument = function(collectionName, doc, updateDocument) {
	let _this = this;
	return new Promise(function(resolve, reject) {
			_this.dbConnection.collection(collectionName).updateMany(doc, updateDocument, function(err, result) {
				if (err) {
					reject(err);
				} else {
					console.log(" Document updated successfully:");
					resolve();
				}
		});
	});
}

/**
 * Deletes a document from a collection
 * @param  {String} collectionName - Name of the collection to delete from.
 * @param  {String} doc - Document to delete.
 * @return {Promise} - Promise that resolves when operation is done.
 */
MongoDao.prototype.deleteDocument = function(collectionName, doc) {
	let _this = this;
	return new Promise(function(resolve, reject) {
			_this.dbConnection.collection(collectionName).deleteOne(doc, function(err, result) {
				if (err) {
					reject(err);
				} else {
					console.log(" Document deleted successfully:");
					resolve();
				}
		});
	});
}

/**
 * Deletes all documents from a collection
 * @param  {String} collectionName - Name of the collection to delete from.
 * @return {Promise} - Promise that resolves when operation is done.
 */
MongoDao.prototype.deleteAllDocuments = function(collectionName) {
	let _this = this;
	return new Promise(function(resolve, reject) {
			_this.dbConnection.collection(collectionName).deleteMany({}, function(err, result) {
				if(err) {
					reject(err);
				} else {
					console.log("cleared all documents successfully");
					resolve();
				}
		});
	});
}

/**
 * Find all documents from a collection that matches a filter
 * @param  {String} collectionName - Name of the collection to delete from.
 * @param  {String} doc - Filter for documents.
 * @return {Promise<Object[]>} - Promise that resolves into a list of documents that matches the filter.
 */
MongoDao.prototype.findDocuments = function(collectionName, doc) {
	let _this = this;
	return new Promise(function(resolve, reject) {
			_this.dbConnection.collection(collectionName).find(doc).toArray((err, docs) => {
				if(err) {
					reject(err);
				} else {
					resolve(docs);
				}
		});
	});
}

module.exports = MongoDao;
