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
  test("200: responds with an empty array if the article requested by the client has no comments ", () => {
    const article_id = 2;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
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

describe("POST/api/articles/:article_id/comments", () => {
  test("201: should respond with an object containing newly posted comment", () => {
    const article_id = 2;
    const newComment = {
      username: "butter_bridge",
      body: "Being fit matters",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toBeInstanceOf(Object);
        expect.objectContaining({
          comment_id: 19,
          author: "butter_bridge",
          body: "Being fit matters",
          article_id: `${article_id}`,
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("400: missing a 'username' key from the client's request", () => {
    const article_id = 2;
    const newComment = {
      body: "Being fit matters",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: missing a 'body' key from the client's request", () => {
    const article_id = 2;
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("404: non-existent article in the database", () => {
    const article_id = 999;
    const newComment = {
      username: "butter_bridge",
      body: "Being fit matters",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`Article ${article_id} Is Not In The Database`);
      });
  });
  test("404: username requested by the client is not in the database", () => {
    const article_id = 2;
    const newComment = {
      username: "peter_griffin",
      body: "Being fit matters",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Username Not Found");
      });
  });
  test("400: invalid data type requested by the client (string)", () => {
    const article_id = "banana";
    const newComment = {
      username: "butter_bridge",
      body: "Being fit matters",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: invalid data type requested by the client (negative integer)", () => {
    const article_id = -12;
    const newComment = {
      username: "butter_bridge",
      body: "Being fit matters",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
    test("400: invalid data type requested by the client (float)", () => {
    const article_id = 3.5;
    const newComment = {
      username: "butter_bridge",
      body: "Being fit matters",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
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
    const inc = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toBeInstanceOf(Object);
        expect.objectContaining({
          article_id: `${article_id}`,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 167,
        });
      });
  });
  test("200: decrements votes by the given amount for a certain article requested by the client", () => {
    const article_id = 1;
    const newVote = -67;
    const inc = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toBeInstanceOf(Object);
        expect.objectContaining({
          article_id: `${article_id}`,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 33,
        });
      });
  });
  test("404: non-existent article in the database ", () => {
    const article_id = 999;
    const newVote = 28;
    const inc = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found In The Database");
      });
  });
  test("400: inc_votes requested by the client is a string", () => {
    const article_id = 2;
    const newVote = "banana";
    const inc = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: inc_votes requested by the client is a float ", () => {
    const article_id = 2;
    const newVote = 89.5;
    const inc = { inc_votes: newVote };
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
    const inc = { inc_votes: newVote };
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
    const inc = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
   test("400: missing 'inc_votes' key in the object requested by the client", () => {
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
   test("400: missing body in the object requested by the client", () => {
    const article_id = 2;
    const newVote = {};
    const inc = { inc_votes: newVote };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(inc)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

      
