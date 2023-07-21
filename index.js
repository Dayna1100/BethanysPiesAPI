// Bring in the express server and create application
let express = require("express");
let app = express();
let pieRepo = require("./repos/pieRepo");
let errorHelpers = require('./helpers/errorHelpers');
let cors = require('cors');

// Use the express Router object
let router = express.Router();

// Configure middleware to support JSON data parsing in request object
app.use(express.json());

// Configure Cors  // see info at https: expressjs.com/en/resources/middleware/cors.html
app.use(cors());


// let pies = [
//   { "id": 1, "name": "Apple" },
//   { "id": 2, "name": "Cherry" },
//   { "id": 3, "name": "Peach" }
// ];
// changing JSON wrapped array to get sample05Repo.js
// let pies = pieRepo.get();  //changing this to functions in router.get below

// Create GET to return a list of all pies
// router.get("/", function (req, res, next) {  // changing this to id below
// router.get("/:id", function (req, res, next) {  // changing this from id to search
// router.get("/search", function (req, res, next) {
// res.status(200).send(pies);  //replacing this line with the info below to wrap in a JSON
// added 2 functions to get data and error
// pieRepo.get(function(data) {  //adding on to this below to get by id

// Create GET to return a list of all pies
router.get("/", function (req, res, next) {
  pieRepo.get(
    function (data) {
      res.status(200).json({
        status: 200,
        statusText: "OK",
        message: "All pies retrieved.",
        data: data,
      });
    },
    function (err) {
      next(err);
    }
  );
});

//create GET/search?id=n&name=str to search for pies by 'id' and/or 'name'
//building search object below
router.get("/search", function (req, res, next) {
  let searchObject = {
    id: req.query.id,
    name: req.query.name,
  };

  pieRepo.search(
    searchObject,
    function (data) {
      res.status(200).json({
        status: 200,
        statusText: "OK",
        message: "All pies retrieved.",
        data: data,
      });
    },
    function (err) {
      next(err);
    }
  );
});
// Create GET/id to return a single pie
router.get("/:id", function (req, res, next) {
  pieRepo.getById(
    req.params.id,
    function (data) {
      if (data) {
        res.status(200).json({
          status: 200,
          statusText: "OK",
          message: "All pies retrieved.",
          data: data,
        });
      } else {
        res.status(404).send({
          status: 404,
          statusText: "Not Found",
          message: "The pie '" + req.params.id + "' could not be found.",
          error: {
            code: "NOT_FOUND",
            message: "The pie '" + req.params.id + "' could not be found.",
          },
        });
      }
    },
    function (err) {
      next(err);
    }
  );
});

// adds status message if complete and adds new pie to json else error message
router.post("/", function (req, res, next) {
  pieRepo.insert(
    req.body,
    function (data) {
      res.status(201).json({
        status: 201,
        statusText: "Created",
        message: "New Pie Added.",
        data: data,
      });
    },
    function (err) {
      next(err);
    }
  );
});

// maps value then updates pie data for that id in the json file, returns status of 200, else error 404
router.put("/:id", function (req, res, next) {
  pieRepo.getById(
    req.params.id,
    function (data) {
      if (data) {
        // Attempt to update the data
        pieRepo.update(req.body, req.params.id, function (data) {
          res.status(200).json({
            status: 200,
            statusText: "OK",
            message: "Pie '" + req.params.id + "' updated.",
            data: data,
          });
        });
      } else {
        res.status(404).send({
          status: 404,
          statusText: "Not Found",
          message: "The pie '" + req.params.id + "' could not be found.",
          error: {
            code: "NOT_FOUND",
            message: "The pie '" + req.params.id + "' could not be found.",
          },
        });
      }
    },
    function (err) {
      next(err);
    }
  );
});

// delete data after searching by id, send status message 202 if good if not 404
router.delete("/:id", function (req, res, next) {
  pieRepo.getById(
    req.params.id,
    function (data) {
      if (data) {
        // Attempt to delete the data record with that id
        pieRepo.delete(req.params.id, function (data) {
          res.status(200).json({
            status: 200,
            statusText: "OK",
            message: "The pie '" + req.params.id + "' is deleted.",
            data: "Pie '" + req.params.id + "' deleted.",
          });
        });
      } else {
        res.status(404).send({
          status: 404,
          statusText: "Not Found",
          message: "The pie '" + req.params.id + "' could not be found.",
          error: {
            code: "NOT_FOUND",
            message: "The pie '" + req.params.id + "' could not be found.",
          },
        });
      }
    },
    function (err) {
      next(err);
    }
  );
});
// patch used to update/change some of the objects properties, not all.
router.patch("/:id", function (req, res, next) {
  pieRepo.getById(
    req.params.id,
    function (data) {
      if (data) {
        // Attempt to update the data after finding ID match
        pieRepo.update(req.body, req.params.id, function (data) {
          res.status(200).json({
            status: 200,
            statusText: "OK",
            message: "Pie '" + req.params.id + "' patched.",
            data: data,
          });
        });
      } else {
        res.status(404).send({
          status: 404,
          statusText: "Not Found",
          message: "The pie '" + req.params.id + "' could not be found.",
          error: {
            code: "NOT_FOUND",
            message: "The pie '" + req.params.id + "' could not be found.",
          },
        });
      }
    },  function (err) {
      next(err);
    }
  );
});

// Configure router so all routes are prefixed with /api/v1
app.use("/api/", router);

// Configure exception logger to console (this was replaced with the code below - we moved the errors to a different .js)
// app.use(function (err, req, res, next) {
//   console.log(errorBuilder(err));  // logs error to console
//   next(err);  // to make sure it continues down the chain - call next midware piece
// });

// Configure exception logger to console  ...have to comment this next line out in order to use errorHelpers.js
//app.use(errorHelpers.logErrors);

// Configure exception logger to console
app.use(errorHelpers.logErrorsToConsole);

// Configure exception logger to file
app.use(errorHelpers.logErrorsToFile);

// adding our own exception middleware . Note: these are run in order they are listed.
// function errorBuilder(err) {
//   return {
//     "status": 500,
//     "statusText": "Internal Server Error",
//     "message": err.message,
//     "error": {
//       "errno": err.errno,
//       "call": err.syscall,
//       "code": "INTERNAL_SERVER_ERROR",
//       "message": err.message
//     }
//   };
// }

// commented out above adding our own exception middleware for the below
// Configure client error handler
app.use(errorHelpers.clientErrorHandler); 


// Configure catch-all exception middleware last
// comment out below - replaced with below...
// app.use(function (err, req, res, next) {
//   res.status(500).json(errorBuilder(err));
  // replacing code below with above to simplify
  // res.status(500).json({
  //   status: 500,
  //   statusText: "Internal Server Error",
  //   message: err.message,
  //   error: {
  //     code: "INTERNAL_SERVER_ERROR",
  //     message: err.message,
  //   }
  // });
// });

// Configure catch-all exception middleware last
app.use(errorHelpers.errorHandler);

// Create server to listen on port 5000
var server = app.listen(5000, function () {
  console.log("Node server is running on http://localhost:5000..");
});
