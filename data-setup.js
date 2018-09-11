
$( document ).ready(function() {

  // function ranking (school, rank, score) {
  function ranking (school, score) {
    this.school = school;
    // this.rank = rank;
    this.score = score;
    this.specialities = [];
  }

  rankings = [];

  // data = import("./data-01.html");
  // import data from "./data-01.html";
  // console.log(data);

  // console.log($("body"));

  overall_rankings = ["us", "uk", "c", "a"];
  specialty_rankings = ["lang", "mind", "mph", "epist", "logic", "action", "reli"];

  // specialty_rankings = {"lang": 5};
  // specialty_list = Object.keys(specialty_rankings);

  function do_one_specialty (i) {

    if (i < specialty_rankings.length) {

      specialty = specialty_rankings[i];
      // how_many = specialty_rankings[specialty];

      // function do_one_sub_specialty (j) {
        // if (j <= how_many) {
        //   console.log(j);

          // file_name = "data/" + specialty + "-" + j + ".html";
      file_name = "data/" + specialty + ".html";

      $("#data").load(file_name, function () {

        $("#data tbody tr").each( function (i) {

          school = $(this).find("td.column-1").html();
          score = $(this).find("td.column-2").html();

          for (i = 0; i < rankings.length; i++) {
            if (rankings[i].school == school) {
              new_entry = {};
              new_entry[specialty] = score;
              rankings[i].specialities.push(new_entry);
              break;
            }
          }

        });

            // do_one_sub_specialty(j+1);

        //   });
        // } else {
        do_one_specialty(i+1);
      });
      // }
      // do_one_sub_specialty(1);
    } else {
      console.log(rankings);
    }

  }

  function do_one_ranking (i) {

    if (i < overall_rankings.length) {

      file_name = "data/overall-" + overall_rankings[i] + ".html";
      $("#data").load(file_name, function () {

        $("#data tbody tr").each( function (i) {
          school = $(this).find("td.column-2 a").html();
          // rank = $(this).find("td.column-1").html();
          // if (rank == "") { rank = "n/a"; }
          score = $(this).find("td.column-3").html();
          // rankings.push(new ranking(school, rank, score));
          rankings.push(new ranking(school, score));
        });

        do_one_ranking(i+1)

      });

    } else {
      do_one_specialty(0);
    }

  }

  do_one_ranking(0);

  // console.log($("#data").html());
  // $("#data").html("asd")
  // console.log("done!");

});

