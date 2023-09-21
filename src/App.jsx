import { useEffect, useState } from "react"
import Card from "./components/Card/Card"
import "./style.css"
import { format, eachDayOfInterval, subWeeks, addDays } from "date-fns"
import classes from "./App.module.css"

const daysOfWeek = {
	Monday: "Понедельник",
	Tuesday: "Вторник",
	Wednesday: "Среда",
	Thursday: "Четверг",
	Friday: "Пятница",
	Saturday: "Суббота",
	Sunday: "Воскресенье",
}

const monthsOfYear = {
	January: "Январь",
	February: "Февраль",
	March: "Март",
	April: "Апрель",
	May: "Май",
	June: "Июнь",
	July: "Июль",
	August: "Август",
	September: "Сентябрь",
	October: "Октябрь",
	November: "Ноябрь",
	December: "Декабрь",
}

function get357Days() {
	// Получаем текущую дату
	const currentDate = new Date()

	//получаем смещенией дней от текущего дня, нужно будет сделать срез массива на это смещение
	let offsetDays = format(currentDate, "i")

	// Создаем массив для хранения списка дат, которые будут перед текущим днем
	let nextDaysList = []
	// Прибавляем 4 дня к текущей дате и добавляем каждую дату в список
	for (let i = 0; i < 7 - offsetDays + 1; i++) {
		const newDate = addDays(currentDate, i)
		nextDaysList.push(format(newDate, "yyyy-MM-dd"))
	}

	nextDaysList = nextDaysList.slice(1)

	// Вычитаем 51 неделю из текущей даты
	let startDate = subWeeks(currentDate, 51)
	// Получаем список всех дат в заданном интервале
	let dates = eachDayOfInterval({ start: startDate, end: currentDate })
	// Выводим список дат в консоль
	let newDates = dates.map((date) => {
		return format(date, "yyyy-MM-dd")
	})

	newDates.splice(0, 7 - offsetDays + 1)
	nextDaysList.forEach((date) => newDates.push(date))

	return newDates
}

//https://dpg.gg/test/calendar.json
async function fetchData(url) {
	let res = await fetch(url)
	res = res.json()
	return res
}

function getFullDate(date) {
	const dayName = format(new Date(date), "EEEE")
	const day = format(new Date(date), "d")
	const monthName = format(new Date(date), "LLLL")
	const year = format(new Date(date), "yyyy")
	const result = `${daysOfWeek[dayName]}, ${monthsOfYear[monthName]} ${day}, ${year}`
	return result
}

function getMonthsNames(dates) {
	let result = []

	try {
		dates.forEach((date) => {
			result.push(monthsOfYear[format(new Date(date), "LLLL")])
		})
		result = result.map((month) => {
			if (month.length > 4) {
				return month.slice(0, 3) + "."
			} else {
				return month
			}
		})

		return Array.from(new Set(result))
	} catch (e) {
		return result
	}
}

function App() {
	const [dates, setDates] = useState([])
	const [fetchDates, setFetchDates] = useState([])

	const [gridItems, setGridItems] = useState([])
	const [months, setMonths] = useState([])

	useEffect(() => {
		fetchData("https://dpg.gg/test/calendar.json")
			.then((res) => {
				setFetchDates(res)
				let days = []
				for (let key in res) {
					days.push(key)
				}
				days = get357Days()
				setDates(days)
			})
			.catch((err) => {
				console.log(err) //можно потом обработать ошибку :)
			})
	}, [])

	useEffect(() => {
		setGridItems(
			dates.map((date, index) => {
				const contributors = fetchDates[date] ?? 0
				const fullDate = getFullDate(date)
				return <Card key={index} contributors={contributors} date={fullDate} />
			})
		)

		let monthsRus = getMonthsNames(dates)
		monthsRus = monthsRus.map((month, index) => {
			return (
				<span key={index} className={classes.monthItem}>
					{month}
				</span>
			)
		})
		setMonths(monthsRus)
	}, [dates])

	return (
		<>
			<div style={{ width: "100vw", margin: "0 auto" }}>
				<div className={classes.container}>
					<div className={classes.month}>{months}</div>
					<div className={classes.row}>
						<div className={classes.colDay}>
							<div className={classes.colItem}>Пн</div>
							<div className={classes.colItem}></div>
							<div className={classes.colItem}>Ср</div>
							<div className={classes.colItem}></div>
							<div className={classes.colItem}>Пт</div>
							<div className={classes.colItem}></div>
							<div className={classes.colItem}></div>
						</div>
						<div className={classes.items}>
							<div className={classes.gridContainer}>{gridItems}</div>
						</div>
					</div>
					<div className={classes.info}>
						<span className={classes.less}>Меньше</span>
						<img
							src="../public/images/colors.svg"
							alt="colors"
							width={"83px"}
							height={"15px"}
							className={classes.imgInfo}
						/>
						<span className={classes.more}>Больше</span>
					</div>
				</div>
			</div>
		</>
	)
}

export default App
