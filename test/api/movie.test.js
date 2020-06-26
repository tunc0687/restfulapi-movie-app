const chai = require("chai");
const chaiHttp = require("chai-http");

const should = chai.should();
const server = require("../../app");

chai.use(chaiHttp);

let token, movieId;
describe("/api/movies tests", () => {
    before((done) => {
        chai.request(server)
            .post("/authenticate")
            .send({username: "stunc", password: "sd1234"})
            .end((err, res) => {
                token = res.body.token;
                done();
            });
    });

    describe("/GET all movie", () => {
        it("it should GET all the movies", (done) => {
            chai.request(server)
                .get("/api/movies")
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    done();
                });
        });
    });

    describe("/POST movies", () => {
        it("it should POST movie", (done) => {
            const movie = {
                director_id : "5ef4783f36fd431318034c41",
                title: "Deneme Movie",
                category: "Crime, Drama",
                country : "Frence",
                year : 2000,
                imdb_score : 7
            };
            chai.request(server)
                .post("/api/movies")
                .set("x-access-token", token)
                .send(movie)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("director_id");
                    res.body.should.have.property("title");
                    res.body.should.have.property("category");
                    res.body.should.have.property("country");
                    res.body.should.have.property("year");
                    res.body.should.have.property("imdb_score");
                    movieId = res.body._id;
                    done();
                });
        });
    });


    describe("/GET/:movie_id movie", () => {
        it("it should GET movie", (done) => {
            chai.request(server)
                .get("/api/movies/" + movieId)
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("director_id");
                    res.body.should.have.property("title");
                    res.body.should.have.property("category");
                    res.body.should.have.property("country");
                    res.body.should.have.property("year");
                    res.body.should.have.property("imdb_score");
                    res.body.should.have.property('_id').eql(movieId);
                    done();
                });
        });
    });
});



