const fs = require("fs");
const User = require("../template/user.template");

const DB = "./data.json";

/**
 * @api {get}
 * @apidescription get all users.
 */
module.exports.allUser = (req, res) => {
  let limit = req?.query?.limit;
  fs.readFile(DB, (err, data) => {
    if (err) {
      res.send(
        JSON.stringify({
          message: "DB not found.",
          code: 502,
        })
      );
    }
    limit = limit || data?.length || 0;
    if (limit < 0) limit = 0;
    res.send(JSON.parse(data).slice(0, +limit) || []);
  });
};

/**
 * @api {get}
 * @apidescription get a random user.
 */
module.exports.randomUser = (req, res) => {
  fs.readFile(DB, (err, data) => {
    if (err) {
      res.send(
        JSON.stringify({
          message: "DB not found.",
          code: 502,
        })
      );
    }
    const users = JSON.parse(data);
    const random_user = Math.floor(Math.random() * users.length);
    res.send(users[random_user] || {});
  });
};

/**
 * @api {get}
 * @apidescription get a user by id.
 */
module.exports.userById = (req, res) => {
  const id = req.params.id;

  const not_found_msz = {
    code: 404,
    message: "user not found.",
  };

  if (!id) res.json(not_found_msz);

  fs.readFile(DB, (err, data) => {
    if (err) {
      res.send(
        JSON.stringify({
          message: "DB not found.",
          code: 502,
        })
      );
    }
    const users = JSON.parse(data) || [];
    const user = users?.find((ele) => +ele.id === +id);
    if (!user) res.json(not_found_msz);
    res.send(user || {});
  });
};

/**
 * @api {post}
 * @apidescription save a user.
 */
module.exports.saveUser = (req, res) => {
  const id = req.params.id;
  const body = req?.body;

  const not_found_msz = {
    code: 400,
    message: "failed to save user.",
  };

  //READ-DB
  fs.readFile(DB, (err, data) => {
    if (err) {
      res.send(
        JSON.stringify({
          message: "DB error.",
          code: 502,
        })
      );
    }
    let users = JSON.parse(data) || [];
    let new_user_id = users?.[(users?.length || 0) - 1]?.id + 1 || 1;
    body.id = new_user_id;
    users.push(new User(body));
    // OVER-DB FILE.
    fs.writeFile(DB, JSON.stringify(users), (err) => {
      if (err)
        res.json({
          message: "DB error.",
          code: 502,
        });

      res.json({
        message: "saved",
        code: 200,
      });
    });
  });
};

/**
 * @api {put}
 * @apidescription update a  user.
 */
module.exports.update = (req, res) => {
  const new_data = req.body;
  const id = +req.params.id;

  fs.readFile(DB, (err, data) => {
    if (err) {
      res.json({
        code: 502,
        message: "Database Error",
      });
    } else {
      const users = JSON.parse(data) || [];
      const item_index = users?.findIndex((ele) => +ele.id === +id);
      users[item_index] = new User({
        ...users[item_index],
        ...new_data,
      });
      fs.writeFile(DB, JSON.stringify(users), (err) => {
        if (err) {
          res.json({
            code: 400,
            message: "failed to update",
          });
        } else {
          res.json({
            code: 200,
            message: "updated",
          });
        }
      });
    }
  });
};

/**
 * @api {put}
 * @apidescription update multiple  user.
 */
module.exports.bulkUpdate = (req, res) => {
  const user_list = req.body || [];
  if (!Array.isArray(user_list)) {
    res.json({
      message: "body should contain an array",
    });
  }

  fs.readFile(DB, (err, data) => {
    if (err) {
      res.json({
        code: 502,
        message: "Database Error",
      });
    } else {
      let users = JSON.parse(data) || [];

      users = users.map((user) => {
        let updated = user_list.find((ele) => +ele?.id === +user?.id) || {};
        return new User({
          ...user,
          ...updated,
        });
      });

      fs.writeFile(DB, JSON.stringify(users), (err) => {
        if (err) {
          res.json({
            code: 400,
            message: "failed to update",
          });
        } else {
          res.json({
            code: 200,
            message: "updated",
          });
        }
      });
    }
  });
};

/**
 * @api {delete}
 * @apidescription save a user.
 */
module.exports.delete = (req, res) => {
  const id = +req.params.id;

  fs.readFile(DB, (err, data) => {
    if (err) {
      res.json({
        code: 502,
        message: "Database Error",
      });
    } else {
      let users = JSON.parse(data) || [];
      users = users?.filter((ele) => +ele.id !== +id);
      fs.writeFile(DB, JSON.stringify(users), (err) => {
        if (err) {
          res.json({
            code: 400,
            message: "failed to delete",
          });
        } else {
          res.json({
            code: 200,
            message: "deleted ",
          });
        }
      });
    }
  });
};
