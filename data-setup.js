
function ranking (school, score, rank, region) {
  this.school = school;
  this.score = score;
  this.country = rank;
  this.world = "";
  this.specialities = [];
  this.region = region;
  this.MYscore = 0;
  this.MYrank = 0;
}

overall_rankings = ["us", "uk", "c", "a"];
specialities = ["lang", "mind", "mph", "epist", "logic", "action", "reli"];
specialty_rankings = ["overall-all"].concat(specialities);

rankings = [];

$(document).ready( function() {

  function do_one_specialty (i) {

    if (i < specialty_rankings.length) {

      specialty = specialty_rankings[i];

      file_name = "data/" + specialty + ".html";

      $("#data").load(file_name, function () {

        $("#data tbody tr").each( function (i) {

          if (specialty == "overall-all") {
            school = $(this).find("td.column-2 a").html();
          } else {
            school = $(this).find("td.column-1").html();
          }

          for (i = 0; i < rankings.length; i++) {
            if (rankings[i].school == school) {
              if (specialty == "overall-all") {
                rank = $(this).find("td.column-1").html();
                rankings[i].world = rank;
                break;
              } else {
                // new_entry = {};
                // score = $(this).find("td.column-2").html();
                // new_entry[specialty] = score;
                // rankings[i].specialities.push(new_entry);
                score = $(this).find("td.column-2").html();
                rankings[i].specialities.push([specialty, score]);
                break;
              }
            }
          }

        });

        do_one_specialty(i+1);
      });
    } else {
      console.log(rankings);
    }
  }

  function do_one_ranking (i) {

    if (i < overall_rankings.length) {

      region = overall_rankings[i];
      file_name = "data/overall-" + region + ".html";
      $("#data").load(file_name, function () {

        $("#data tbody tr").each( function (i) {
          school = $(this).find("td.column-2 a").html();
          if (school != undefined) {
            score = parseFloat($(this).find("td.column-3").html());
            rank = $(this).find("td.column-1").html();
            rankings.push(new ranking(school, score, rank, region));
          }
        });

        do_one_ranking(i+1)
      });
    } else {
      do_one_specialty(0);
    }
  }
  do_one_ranking(0);

});

function results (id) {

  error = 0;
  message = "";

  $("div#examples").addClass("hidden");

  text = $("textarea#"+id).val().trim();
  $("textarea#4").html(text);

  lines = text.split("\n");
  regions = lines[0].split(" ");
  us = 0;
  uk = 0;
  c = 0;
  a = 0;
  for (i = 0; i < regions.length; i++) {
    region = regions[i];
    if (region == "us") {
      us = 1;
    } else if (region == "uk") {
      uk = 1;
    } else if (region == "c") {
      c = 1;
    } else if (region == "a") {
      a = 1;
    } else {
      error = 1;
      message = "\""+region+"\" is an invalid region."
      break;
    }
  }

  factor = 0;

  if (error == 0) {

    new_rankings = [];
    for (i = 0; i < rankings.length; i++) {
      this_ranking = rankings[i];
      this_ranking.MYscore = 0;
      if ((this_ranking.region == "us") && (us == 1)) {
        new_rankings.push(this_ranking);
      } else if ((this_ranking.region == "uk") && (uk == 1)) {
        new_rankings.push(this_ranking);
      } else if ((this_ranking.region == "c") && (c == 1)) {
        new_rankings.push(this_ranking);
      } else if ((this_ranking.region == "a") && (a == 1)) {
        new_rankings.push(this_ranking);
      }
    }

    for (i = 1; i < lines.length; i++) {
      line = lines[i];
      parts = line.split(" ");
      if (parts.length != 2) {
        error = 1;
        message = "\""+line+"\" does not have exactly 2 arguments.";
        break;
      } else {
        specialty = parts[0];
        if ((!specialities.includes(specialty)) && (specialty != "overall")) {
          error = 1;
          message = "\""+specialty+"\" is not a valid specialty.";
          break;
        } else {
          weight = parseFloat(parts[1]);
          if (isNaN(weight)) {
            error = 1;
            message = "\""+parts[1]+"\" is not a number.";
            break;
          } else {
            factor += weight;

            for (j = 0; j < new_rankings.length; j++) {
              if (specialty == "overall") {
                new_rankings[j].MYscore += new_rankings[j].score * weight;
              } else {
                for (k = 0; k < new_rankings[j].specialities.length; k++) {
                  if (new_rankings[j].specialities[k][0] == specialty) {
                    new_rankings[j].MYscore += new_rankings[j].specialities[k][1] * weight;
                  }
                }
              }
            }

          }
        }
      }
    }
  }

  if ((error == 0) && (new_rankings.length > 0)) {

    new_rankings.sort(function(a,b){
      return b.MYscore - a.MYscore;
    });

    rank = 1;
    offset = 0;
    for (i = 0; i < new_rankings.length; i++) {
      new_rankings[i].MYrank = rank;
      if (i+1 < new_rankings.length) {
        if (new_rankings[i].MYscore > new_rankings[i+1].MYscore) {
          rank++;
          rank += offset;
          offset = 0;
        } else {
          offset++;
        }
      }
      new_rankings[i].MYscore /= factor;
    }

  }

  $("div#results").removeClass("hidden");
  if (error == 0) {

    $("table#rankings").html("");

    header = "<tr>";
    header += "<td>My Rank</td>";
    header += "<td>My Score</td>";
    header += "<td>School Name</td>";
    header += "<td>World Score</td>";
    header += "<td>World Rank</td>";
    header += "<td>Country Rank</td>";
    header += "</tr>";
    $("table#rankings").append(header);

    for (i = 0; i < new_rankings.length; i++) {
      this_ranking = new_rankings[i];

      newRow = "<tr>";
      newRow += "<td>"+this_ranking.MYrank+"</td>";
      newRow += "<td>"+this_ranking.MYscore.toFixed(2)+"</td>";
      newRow += "<td>"+this_ranking.school+"</td>";
      newRow += "<td>"+this_ranking.score.toFixed(1)+"</td>";
      newRow += "<td>"+this_ranking.world+"</td>";
      newRow += "<td>"+this_ranking.country+"</td>";
      newRow += "</tr>";

      $("table#rankings").append(newRow);

    }

    $("div#resultsGood").removeClass("hidden");
    $("div#resultsError").addClass("hidden");
  } else {
    $("div#resultsError").removeClass("hidden");
    $("div#resultsGood").addClass("hidden");
    $("div#errorMessage").html(message);
  }
}

