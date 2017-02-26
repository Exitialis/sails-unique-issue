let sails = require('sails');

chai = require('chai');
expect = chai.expect;


describe('reproduce unique validation bug with mysql adapter', () => {
  before(function (done) {
    this.timeout(5000);

    sails.lift({
      log: {
        level: 'silent'
      },
      hooks: {
        grunt: false
      },
      models: {
        connection: 'unitTestConnection',
        migrate: 'drop'
      },
      connections: {
        unitTestConnection: {
          adapter: 'sails-mysql',
          host: 'localhost',
          user: 'root',
          password: 'root',
          database: 'temp'
        }
      }

    }, (err, server) => {
      if (err) return done(err);

      User.create({
        login: 'test',
        email: 'test@gmail.com'
      }).then(() => {
        done();
      }).catch(err => {
        done(err, sails);
      });
    });
  });

  it('return validation error only for login attribute', done => {
    User.create({login: 'test', email: 'test@gmail.com'}).catch(err => {
      expect(err.ValidationError).to.be.not.null;
      expect(err.ValidationError.login).to.be.not.null;
      expect(err.ValidationError.login[0]).to.have.property('rule', 'unique');
      expect(err.ValidationError.email).to.be.undefined;
      done();
    })
  });

  it('return validation error only for email attribute', done => {
    User.create({login: 'test2', email: 'test@gmail.com'}).catch(err => {
      expect(err.ValidationError).to.be.not.null;
      expect(err.ValidationError.email).to.be.not.null;
      expect(err.ValidationError.email[0]).to.have.property('rule', 'unique');
      expect(err.ValidationError.login).to.be.undefined;
      done();
    })
  });

  after(function (done) {
    if (sails) {
      sails.lower(done);
    }
  });
});





