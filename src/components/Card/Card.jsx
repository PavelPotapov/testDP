import classes from "./Card.module.css"
import Tooltip from "./Tooltip/Tooltip"
import { useEffect, useState } from "react"

const colorsContributors = [
	{
		min: 1,
		max: 9,
		color: "#ACD5F2",
	},
	{
		min: 10,
		max: 19,
		color: "#7FA8C9",
	},
	{
		min: 20,
		max: 29,
		color: "#527BA0",
	},
	{
		min: 30,
		max: Infinity,
		color: "#254E77",
	},
]

function getColor(contributors) {
	for (let el of colorsContributors) {
		if (el.min < contributors && el.max > contributors) {
			return el.color
		}
	}
	return "#EDEDED"
}

function Card({ contributors, date }) {
	const [state, setState] = useState({
		contributors: contributors,
		date: date,
	})

	const [isHovered, setIsHovered] = useState(false)
	const [color, setColor] = useState("#EDEDED")
	const [selected, setSelected] = useState(false)
	useEffect(() => {
		setColor(getColor(contributors))
	}, [])

	return (
		<div
			className={classes.card}
			style={{
				backgroundColor: color,
				border: selected
					? "1px solid rgba(0, 0, 0, 0.90)"
					: isHovered
					? "1px solid rgba(0, 0, 0, 0.5)"
					: "none",
			}}
			onClick={() => {
				setIsHovered(true)
				setSelected(true)
			}}
			onMouseLeave={() => {
				setIsHovered(false)
				setSelected(false)
			}}
			onMouseEnter={() => setIsHovered(true)}
		>
			{selected ? <Tooltip {...state} /> : null}
		</div>
	)
}

export default Card
