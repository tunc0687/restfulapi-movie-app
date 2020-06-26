const chai = require("chai");
const chaiHttp = require("chai-http");

const should = chai.should();
const server = require("../../app");

chai.use(chaiHttp);

let token, directorId;
describe("/api/directors tests", () => {
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

    describe("/GET all director", () => {
        it("it should GET all the directors", (done) => {
            chai.request(server)
                .get("/api/directors")
                .set("x-access-token", token)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    // res.body.should.have.property("movies");
                    done();
                });
        });
    });


    describe("/POST directors", () => {
        it("it should POST director", (done) => {
            const director = {
                fullname: "Uluç Bayraktar",
                bio: "Güzel bir hayat sürmektedir. Birçok film ve dizi yönetmiştir."
            };
            chai.request(server)
                .post("/api/directors")
                .set("x-access-token", token)
                .send(director)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("fullname");
                    res.body.should.have.property("bio");
                    directorId = res.body._id;
                    done();
                });
        });
    });


    describe("/GET/:director_id director", () => {
        it("it should GET director", (done) => {
            chai.request(server)
                .get("/api/directors/" + directorId)
                .set("x-access-token", token)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("fullname");
                    res.body.should.have.property("bio");
                    // res.body.should.have.property("movies");
                    res.body.should.have.property('_id').eql(directorId);
                    done();
                });
        });
    });

    describe("/PUT director", () => {
        it("it should UPDATE a director given by id", (done) => {
            const director = {
                fullname: "Kamil Dere",
                bio: "Yönetmenliği bırakmıştır. Sokaklarda yatiyahh. Birçok film ve dizi yönetmiştir."
            };
            chai.request(server)
                .put("/api/directors/" + directorId)
                .set("x-access-token", token)
                .send(director)
                .end((err, res) => {
                    if (err)
                        throw err;
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("fullname");
                    res.body.should.have.property("bio");
                    res.body.should.have.property('_id').eql(directorId);
                    done();
                });
        })
    });

    describe("/DELETE/:director_id director", () => {
        it("it should DELETE director", (done) => {
            chai.request(server)
                .delete("/api/directors/" + directorId)
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



