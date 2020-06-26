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
                if (err)
                    throw err;
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
                    if (err)
                        throw err;
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    done();
                });
        });
    });

    describe("/GET top10 movie", () => {
        it("it should GET top10 movies", (done) => {
            chai.request(server)
                .get("/api/movies/top10")
                .set("x-access-token", token)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.should.have.lengthOf(10);
                    done();
                });
        });
    });

    describe("/GET between movie", () => {
        it("it should GET top10 movies", (done) => {
            const [start_year, end_year] = [1980, 2020];
            chai.request(server)
                .get(`/api/movies//between/${start_year}/${end_year}`)
                .set("x-access-token", token)
                .end((err, res) => {
                    if (err)
                        throw err;
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
                    if (err)
                        throw err;
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
                    if (err)
                        throw err;
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

    describe("/PUT movie", () => {
        it("it should UPDATE a movie given by id", (done) => {
            const movie = {
                director_id : "5ef26ca874e2961e1c685e2e",
                title: "Updated Movie",
                category: "Drama",
                country : "Spain",
                year : 2008,
                imdb_score : 7.5
            };
            chai.request(server)
                .put("/api/movies/" + movieId)
                .set("x-access-token", token)
                .send(movie)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property('title').eql(movie.title);
                    res.body.should.have.property('director_id').eql(movie.director_id);
                    res.body.should.have.property('category').eql(movie.category);
                    res.body.should.have.property('country').eql(movie.country);
                    res.body.should.have.property('year').eql(movie.year);
                    res.body.should.have.property('imdb_score').eql(movie.imdb_score);
                    res.body.should.have.property('_id').eql(movieId);
                    done();
                });
        })
    });

    describe("/DELETE/:movie_id movie", () => {
        it("it should DELETE movie", (done) => {
            chai.request(server)
                .delete("/api/movies/" + movieId)
                .set("x-access-token", token)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property('status').eql(1);
                    done();
                });
        });
    });

});



