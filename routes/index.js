/**
 *  INDEX
 *
 *  Entry point for the Universal Reporting System.
 *  This file handles all the routing code.
 */
"use strict";

const fs = require('fs');
var express = require("express");
var router = express.Router();

router.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

router.get("/", function(req, res, next) {
  let siteData = {};

  // Block and read the site data.
  fs.readFile("public/lrt.json", (err, data) => {
      if (err) throw err;
      siteData = JSON.parse(data);
      res.render("index", siteData);      
  });
 
});

router.get("/admin", function(req, res, next) {
  if (req.query.pass == process.env.ADMIN_PASS) {    
    let siteData = {};
    fs.readFile("public/lrt.json", (err, data) => {
      if (err) throw err;
      siteData = JSON.parse(data);
      res.render("admin", siteData);      
    });
  } else { 
    res.redirect("/");
  }
});


router.post("/admin", function(req, res, next) {
  let siteData = req.body;

  var fileName = "public/lrt.json";
  var file = require("../" + fileName);

  // Setting form values
  file.currentStatus.overallStatus = req.body.overallStatus;
  let nowTime = Date.now();
  let incidentTime = req.body.timestamp;

  function chkChanged(stopName) {

    // Use the new time, except if same or success
    let lastUpdated = ""

    if (req.body["overallStatus_" + stopName] == "success") {
      // Different
      lastUpdated = nowTime;
    } else {
      // Same
      lastUpdated = file.currentStatus.stopStatus.l1[stopName].lastupdated;
    }

    let rtn = {
      "status": req.body["overallStatus_" + stopName],
      "tooltipText": req.body["tooltipText_" + stopName],
      "lastupdated": lastUpdated,
      "activeEvents": file.currentStatus.stopStatus.l1[stopName].activeEvents
    };

    rtn.activeEvents.unshift({
        "timestamp": incidentTime,
        "severity": req.body["overallStatus_" + stopName],
        "title": req.body.subText,
        "details": req.body.reason_long
    });

    return rtn;
  }  

 file.currentStatus.stopStatus = {
    "l1": {
        "Tunneys_Pasture": chkChanged("Tunneys_Pasture"),
        "Bayview": chkChanged("Bayview"),
        "Pimisi": chkChanged("Pimisi"),
        "Lyon":chkChanged("Lyon"),
        "Parliament": chkChanged("Parliament"),
        "Rideau": chkChanged("Rideau"),
        "uOttawa": chkChanged("uOttawa"),
        "Lees": chkChanged("Lees"),
        "Hurdman":chkChanged("Hurdman"),
        "Tremblay":chkChanged("Tremblay"),
        "St_Laurent": chkChanged("St_Laurent"),
        "Cyrville": chkChanged("Cyrville"),
        "Blair": chkChanged("Blair")
    },
    "l2": {
        "Carling": {
            "status": req.body.overallStatus_Carling,
            "tooltipText": req.body.tooltipText_Carling,
            "lastupdated": nowTime
        },
        "Carleton": {
            "status": req.body.overallStatus_Carleton,
            "tooltipText": req.body.tooltipText_Carleton,
            "lastupdated": nowTime
        },
        "Confederation": {
            "status": req.body.overallStatus_Confederation,
            "tooltipText": req.body.tooltipText_Confederation,
            "lastupdated": nowTime
        },
        "Greenboro": {
            "status": req.body.overallStatus_Greenboro,
            "tooltipText": req.body.tooltipText_Greenboro,
            "lastupdated": nowTime
        }
    }
  }

  file['events'].unshift({
    "timestamp": incidentTime,
    "severity": req.body.overallStatus,
    "durLeaveUpMin": req.body.durLeaveUpMin,
    "active": true,
    "subtext": req.body.subText,
    "location": {
      "text": req.body.location,
      "affectedStops": {
          "l1": {
            "Tunneys_Pasture": {
              "status": req.body.overallStatus_Tunneys_Pasture,
              "tooltipText": req.body.tooltipText_Tunneys_Pasture
            },
            "Bayview": {
              "status": req.body.overallStatus_Bayview,
              "tooltipText": req.body.tooltipText_Bayview
            },
            "Pimisi": {
              "status": req.body.overallStatus_Pimisi,
              "tooltipText": req.body.tooltipText_Pimisi
            },
            "Lyon": {
              "status": req.body.overallStatus_Lyon,
              "tooltipText": req.body.tooltipText_Lyon
            },
            "Parliament": {
              "status": req.body.overallStatus_Parliament,
              "tooltipText": req.body.tooltipText_Parliament
            },
            "Rideau": {
              "status": req.body.overallStatus_Rideau,
              "tooltipText": req.body.tooltipText_Rideau
            },
            "uOttawa": {
              "status": req.body.overallStatus_uOttawa,
              "tooltipText": req.body.tooltipText_uOttawa
            },
            "Lees": {
              "status": req.body.overallStatus_Lees,
              "tooltipText": req.body.tooltipText_Lees
            },
            "Hurdman": {
              "status": req.body.overallStatus_Hurdman,
              "tooltipText": req.body.tooltipText_Hurdman
            },
            "Tremblay": {
              "status": req.body.overallStatus_Tremblay,
              "tooltipText": req.body.tooltipText_Tremblay
            },
            "St_Laurent": {
              "status": req.body.overallStatus_St_Laurent,
              "tooltipText": req.body.tooltipText_St_Laurent
            },
            "Cyrville": {
                "status": req.body.overallStatus_Cyrville,
                "tooltipText": req.body.tooltipText_Cyrville
            },
            "Blair": {
                "status": req.body.overallStatus_Blair,
                "tooltipText": req.body.tooltipText_Blair
            }
          },
          "l2": {
            "Carling": {
                "status": req.body.overallStatus_Carling,
                "tooltipText": req.body.tooltipText_Carling
            },
            "Carleton": {
                "status": req.body.overallStatus_Carleton,
                "tooltipText": req.body.tooltipText_Carleton
            },
            "Confederation": {
                "status": req.body.overallStatus_Confederation,
                "tooltipText": req.body.tooltipText_Confederation
            },
            "Greenboro": {
                "status": req.body.overallStatus_Greenboro,
                "tooltipText": req.body.tooltipText_Greenboro
            }
          }
        }
      },
      "reason": {
        "short": req.body.reason_short,
        "long": req.body.reason_long
      }
    })

  fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {

    // Set timer to expire the changes to "good"
    let milisecondsNum = (req.body.durLeaveUpMin*60)*1000;
    setTimeout(expireEvent, milisecondsNum);

  });

  res.redirect("/");
});

function expireEvent(){
  
  var fileName = "public/lrt.json";
  var file = require("../" + fileName);

  function statusWriter(stopName) {
    let commonStatusText = "Last updated by incident "
    let datezor = new Date(file.currentStatus.stopStatus.l1[stopName].lastupdated); 
    return {
      "status": "success",
      "tooltipText": commonStatusText + datezor.toLocaleString('en-CA'),
      "lastupdated": file.currentStatus.stopStatus.l1[stopName].lastupdated
    };
  }  

  // Setting form values
  file.currentStatus.overallStatus = "success";

  file.currentStatus.stopStatus = {
      "l1": {
          "Tunneys_Pasture": statusWriter("Tunneys_Pasture"),
          "Bayview": statusWriter("Bayview"),
          "Pimisi":statusWriter("Pimisi"),
          "Lyon": statusWriter("Lyon"),
          "Parliament": statusWriter("Parliament"),
          "Rideau": statusWriter("Rideau"),
          "uOttawa": statusWriter("uOttawa"),
          "Lees": statusWriter("Lees"),
          "Hurdman": statusWriter("Hurdman"),
          "Tremblay": statusWriter("Tremblay"),
          "St_Laurent":statusWriter("St_Laurent"),
          "Cyrville": statusWriter("Cyrville"),
          "Blair": statusWriter("Blair")
      },
      "l2": {
          "Carling": {
              "status": "success",
              "tooltipText": "Last incident was " + new Date(file.currentStatus.stopStatus.l1.Blair.lastupdated ),
              "lastupdated": file.currentStatus.stopStatus.l2.Carling.lastupdated
          },
          "Carleton": {
              "status": "success",
              "tooltipText": "Last incident was " + new Date(file.currentStatus.stopStatus.l1.Blair.lastupdated ),
              "lastupdated": file.currentStatus.stopStatus.l2.Carleton.lastupdated
          },
          "Confederation": {
              "status": "success",
              "tooltipText": "Last incident was " + new Date(file.currentStatus.stopStatus.l1.Blair.lastupdated ),
              "lastupdated": file.currentStatus.stopStatus.l2.Confederation.lastupdated
          },
          "Greenboro": {
              "status": "success",
              "tooltipText": "Last incident was " + new Date(file.currentStatus.stopStatus.l1.Blair.lastupdated ),
              "lastupdated": file.currentStatus.stopStatus.l2.Greenboro.lastupdated
          }
      }
  };

  fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {});
}

module.exports = router;
