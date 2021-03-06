const mysql = require('mysql');
const { expect } = require('chai');
const db = require('../../database/index.js');
const model = require('../../database/model.js');


describe('codeOp database', () => {
  let dbConnection;

  beforeEach((done) => {
    dbConnection = mysql.createConnection({
      user: 'root',
      database: 'codeop',
    });
    dbConnection.connect();

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    // also reset auto increment
    dbConnection.query('TRUNCATE projects', () => {
      dbConnection.query('ALTER TABLE projects AUTO_INCREMENT = 1', done);
    });
  });

  afterEach(() => {
    dbConnection.end();
  });

  it('Should insert project name', (done) => {
    const data = {
      project_name: 'banana'
    };
    model.insertProjectData(data)
      .then(() => {
        const query = `SELECT * FROM projects WHERE project_name = '${data.project_name}';`;
        console.log('select query', query);
        return dbConnection.query(query, (err, results) => {
          if (err) {
            throw err;
          } else {
            expect(results.length).to.equal(1);
            done();
          }
        });
      });
  });
});
