function drawSvg(dataset) {
  const width = 900;
  const height = 600;
  const margin = 60;

  let timeFormat = d3.timeFormat("%M:%S");
  timeFormat(new Date());
  var time = dataset.map((item) => item.Time);

  console.log(time);
  var years = dataset.map((item) => item.Year);
  var seconds = dataset.map((item) => item.Seconds);
  var fastest = d3.max(dataset.map((item) => item.Seconds));
  var slowest = d3.min(dataset.map((item) => item.Seconds));
  console.log(years);
  console.log(fastest);
  console.log(slowest);

  let xScale = d3
    .scaleLinear()
    .domain([d3.min(years) - 1, d3.max(years)])
    .range([margin, width - margin]);
  let yScale = d3
    .scaleLinear()
    .domain([fastest + 10, slowest])
    .range([height - margin, margin]);

  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  let yAxis = d3.axisLeft(yScale).tickFormat(function (seconds) {
    var minute = Math.floor(seconds / 60);
    var second = +(seconds % 60).toFixed(0);
    return second == 60
      ? minute + 1 + ":00"
      : minute + ":" + (second < 10 ? "0" : "") + second;
  });

  let tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);

  let svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#ecf0f1");

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d, i) => xScale(years[i]))
    .attr("cy", (d, i) => yScale(seconds[i]))
    .attr("r", 5)
    .attr("fill", (d) => d.URL? "#c0392b":"#27ae60")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", function (d) {
      let parsedTime = d.Time.split(":");
      return (d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
    })
    .on("mouseover", function (d, i) {
      d3.select(this).attr("fill", "#2980b9");
      tooltip.style("opacity", 1);
      tooltip.attr("data-year", d.Year);
      tooltip.html(
        "<strong>" +
          d.Name +
          "</strong>" +
          ": " +
          d.Nationality +
          "<br/>" +
          "Year: " +
          d.Year +
          "<br/>" +
          "Place: " +
          d.Place +
          "<br/>" +
          "Time: " +
          timeFormat(d.Time) +
          (d.Doping ? "<br/><br/>" + "Doping: " + d.Doping : "") +
          (d.URL ? "<br/><br/>" + "Click for more information" : "")
      );
      tooltip
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY + "px");
    })
    .on("mouseout", function (d) {
      d3.select(this).attr("fill", (d) => d.URL? "#c0392b":"#27ae60");
      tooltip.style("opacity", 0);
    })
    .on("click", function (d) {
      if (d.URL) {
        let win = window.open(d.URL, "_blank");
        win.focus();
      }
    });

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - margin) + ")");

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + margin + ", 0)");

  svg
    .append("text")
    .attr("id", "legend")
    .text("- Hover on the dots for more information")
    .attr(
      "transform",
      "translate(" + (width / 2 + margin * 3) + "," + (height - 15) + ") "
    );

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -120)
    .attr("y", 15)
    .style("font-size", 16)
    .text("Time in Minutes");
}

d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
  function (error, data) {
    let dataset = data;
    drawSvg(dataset);
    console.log(data);
  }
);
