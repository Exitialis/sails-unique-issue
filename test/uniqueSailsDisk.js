const Sails = require('sails').Sails;
const sails = new Sails();

describe('works perfectly for sails-disk adapter', () => {
  before(function (done) {
    this.timeout(5000);

    sails.load({
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
          adapter: 'sails-disk',
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

  it('return validation errors for both attributes', done => {
    User.create({login: 'test', email: 'test@gmail.com'}).catch(err => {
      expect(err.ValidationError).to.be.not.null;
      expect(err.ValidationError.login).to.be.not.null;
      expect(err.ValidationError.login[0]).to.have.property('rule', 'unique');
      expect(err.ValidationError.email).to.be.not.null;
      expect(err.ValidationError.email[0]).to.have.property('rule', 'unique');
      done();
    })
  });

  after(function (done) {
    if (sails) {
      sails.lower(done);
    }
  });
});