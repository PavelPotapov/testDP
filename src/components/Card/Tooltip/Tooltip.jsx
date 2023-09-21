import classes from "./Tooltip.module.css"

function Tooltip(props) {
	return (
		<div>
			<div className={classes.tooltip}>
				<p className={classes.tooltip__title}>
					{" "}
					{props.contributors} contributions
				</p>
				<p className={classes.tooltip__subtitle}>{props.date}</p>
			</div>
		</div>
	)
}
export default Tooltip
