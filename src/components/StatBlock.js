import HelpOutlineIcon from "@material-ui/icons/HelpOutline"
import { PropTypes } from "prop-types"
import React from "react"
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts"

import { objToArray } from "../utils/object"

const StatBlock = ({ children }) => {
  return (
    <div
      style={{
        width: "300px",
        height: "260px",
        border: "1px solid rgba(46,91,255,0.08)",
        display: "inline-block",
        color: "#BBB",
        borderRadius: 1,
        padding: "10px 10px 10px 20px",
        margin: "10px 20px",
        boxShadow: "0 10px 20px 0 rgba(46,91,255,0.07)",
        textAlign: "left",
      }}
      className="rounded-lg"
    >
      {children}
    </div>
  )
}

StatBlock.propTypes = {
  children: PropTypes.array,
}

export const StatBlockNumbers = ({ title, firstNumber, firstLabel, secondNumber, secondLabel }) => {
  return (
    <StatBlock>
      <div
        className="text-center"
        style={{ display: "inline-flex", verticalAlign: "middle", alignItems: "center", width: "100%" }}
        aria-hidden="true"
      >
        <span
          style={{
            height: 24,
            color: "#212529",
            fontFamily: "Evolventa",
            fontSize: 18,
            fontWeight: 400,
            width: "100%",
          }}
          id="statNumbersTitle"
        >
          {title}
        </span>
      </div>
      <div aria-labelledby="statNumbersTitle" tabIndex="0">
        <span id="statNumbersTitle" className="sr-only">
          Données {title}
        </span>
        <p style={{ color: "#2E384D", fontSize: 35, fontFamily: "Evolventa" }}>{firstNumber}</p>
        <p
          style={{
            color: "#4a4a4a",
            marginTop: -25,
            marginLeft: 2,
            fontSize: 15,
            fontFamily: "Source Sans Pro",
          }}
          className="mb-4"
        >
          {firstLabel}
        </p>
        <p style={{ color: "#2E384D", fontSize: 35, fontFamily: "Evolventa" }}>{secondNumber}</p>
        <p
          style={{
            color: "#4a4a4a",
            marginTop: -25,
            marginLeft: 2,
            fontSize: 15,
            fontFamily: "Source Sans Pro",
          }}
        >
          {secondLabel}
        </p>
      </div>
    </StatBlock>
  )
}

StatBlockNumbers.propTypes = {
  title: PropTypes.string,
  firstNumber: PropTypes.number,
  firstLabel: PropTypes.string,
  secondNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  secondLabel: PropTypes.string,
}

export const StatBlockPieChart = ({ data, labels = [], hoverTitle, title }) => {
  const values = objToArray(data, labels)

  return (
    <StatBlock>
      <div aria-labelledby="statPieChartTitle" aria-describedby="statPieChartDescription" tabIndex="0">
        <span id="statPieChartTitle" className="sr-only">
          Graphique {title} {hoverTitle ? "(" + hoverTitle + ")" : ""}
        </span>
        <p id="statPieChartDescription" className="sr-only">
          {getChartPieDescription(values)}
        </p>
        <div
          aria-hidden="true"
          className="text-center"
          style={{ display: "inline-flex", verticalAlign: "middle", alignItems: "center", width: "100%" }}
          title={hoverTitle}
        >
          <span
            style={{
              height: 24,
              color: "#212529",
              fontFamily: "Evolventa",
              fontSize: 18,
              fontWeight: 400,
              width: "100%",
            }}
          >
            {title}
          </span>
          {hoverTitle && <HelpOutlineIcon fontSize="small" />}
        </div>
      </div>
      <div aria-hidden="true">
        <PieChart width={280} height={210} role="img">
          <Pie
            data={values}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={70}
            innerRadius={20}
            labelLine={false}
            label={RenderCustomizedLabel}
          >
            {values.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ color: "#9f9f9f" }} />
        </PieChart>
      </div>
    </StatBlock>
  )
}

StatBlockPieChart.propTypes = {
  data: PropTypes.object.isRequired,
  labels: PropTypes.array,
  hoverTitle: PropTypes.string,
  title: PropTypes.string,
}

const colors = ["#307df6", "#ed6b67", "#eaa844", "#7ce0c3", "#ad33d8", "#f687b3", "#2f855a", "#c05621"]

const RADIAN = Math.PI / 180

const RenderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const getChartPieDescription = (donnees) => {
  let total = 0
  donnees.forEach((e) => {
    total += e.value
  })
  if (total != 0) {
    let description = "Ce graphique présente les données suivantes : "
    donnees.forEach((e) => {
      description += e.name + " : " + e.value + " (soit " + Math.round((e.value * 100) / total) + "%), "
    })
    return description.slice(0, -2)
  } else {
    return "Ce graphique ne présente aucune donnée"
  }
}

RenderCustomizedLabel.propTypes = {
  cx: PropTypes.any,
  cy: PropTypes.any,
  midAngle: PropTypes.any,
  innerRadius: PropTypes.any,
  outerRadius: PropTypes.any,
  percent: PropTypes.any,
}
