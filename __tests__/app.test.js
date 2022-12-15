const request = require("supertest");
const db = require("../db/connection.js");
const { app } = require("../app");

const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("Error 404: Non-existent route", () => {
  test("non-existent path", () => {
    return request(app)
      .get("/api/top")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Path Not Found" });
      });
  });
});

describe("GET/api/topics", () => {
  test("200: should return array of all the topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toBeInstanceOf(Object);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET/api/articles", () => {
  test("200: should return array of all the article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Object);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("200: articles should be sorted by date in descending order by default ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("404: non-existent route", () => {
    return request(app)
      .get("/api/articl")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Path Not Found" });
      });
  });
});

describe("GET/api/articles/:article_id", () => {
  test("200: responds with an article object requested by the client", () => {
    const article_id = 3;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual([
          {
            article_id: 3,
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
          },
        ]);
      });
  });
  test("404: non-existent article in the database ", () => {
    const article_id = 999;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found In The Database");
      });
  });
  test("400: invalid data type requested by the client (string)", () => {
    const article_id = "banana";
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: invalid data type requested by the client (negative integer)", () => {
    const article_id = -5;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: invalid data type requested by the client (float)", () => {
    const article_id = 6.5;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET/api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article requested by the client", () => {
    const article_id = 6;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("200: responds with an array of most recent comments for the given article requested by the client", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: responds with a message if the article requested by the client has no comments ", () => {
    const article_id = 2;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`Article ${article_id} has no comments`);
      });
  });
  test("404: non-existent article in the database", () => {
    const article_id = 999;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found In The Database");
      });
  });
  test("400: invalid data type requested by the client (string)", () => {
    const article_id = "banana";
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: invalid data type requested by the client (float)", () => {
    const article_id = 8.5;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: invalid data type requested by the client (negative integer)", () => {
    const article_id = -10;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("PATCH/api/articles/:article_id", () => {
  test("200: increments votes by the given amount for a certain article requested by the client", () => {
    const article_id = 1;
    const newVote = 67;
    const inc = { incVote: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(200)
      .then(({ body: { votes } }) => {
        expect(votes[0].votes).toBe(167);
        votes.forEach((vote) => {
          expect(vote).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("200: decrements votes by the given amount for a certain article requested by the client", () => {
    const article_id = 1;
    const newVote = -67;
    const inc = { incVote: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(200)
      .then(({ body: { votes } }) => {
        expect(votes[0].votes).toBe(33);
        votes.forEach((vote) => {
          expect(vote).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("404: non-existent article in the database ", () => {
    const article_id = 999;
    const newVote = 28;
    const inc = { incVote: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found In The Database");
      });
  });
  test("400: newVote requested by the client is a string", () => {
    const article_id = 2;
    const newVote = "banana";
    const inc = { incVote: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: newVote requested by the client is a float ", () => {
    const article_id = 2;
    const newVote = 89.5;
    const inc = { incVote: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: invalid article_id requested by the client (string) ", () => {
    const article_id = "banana";
    const newVote = 28;
    const inc = { incVote: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: invalid article_id requested by the client (float) ", () => {
    const article_id = 3.5;
    const newVote = 28;
    const inc = { incVote: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: missing newVote key in the object requested by the client", () => {
    const article_id = 2;

    const inc = { noVoteRequested: 45 };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  
});
