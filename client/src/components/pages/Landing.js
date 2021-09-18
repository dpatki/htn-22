import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from "axios"
import M from "materialize-css";

import LinearLoadingSymbol from "../layout/LinearLoadingSymbol";
import './Landing.css'

const mockData = {
    timedata: [
        {
            date: new Date("2021-09-11"),
            notes: "kjsdlf;fs;sdfjoisfoijfojifoijf",
            sleeptime: 12,
            sleepquality: 5
        },
        {
            date: new Date("2021-09-12"),
            notes: "wheeeeeeeeeeeeeeeeeeeeeee eeeee ee e e e e",
            sleeptime: 3,
            sleepquality: 1
        },
        {
            date: new Date("2021-09-13"),
            notes: "blah blah blah blah blah blahhhhh booooooooooooop",
            sleeptime: 9,
            sleepquality: 4
        },
        {
            date: new Date("2021-09-14"),
            notes: "i like cheese and it is salty wheeeee alsdf abacus",
            sleeptime: 5,
            sleepquality: 10
        },
        {
            date: new Date("2021-09-15"),
            notes: "",
            sleeptime: 8,
            sleepquality: 8
        },
        {
            date: new Date("2021-09-16"),
            notes: "asdfsdf",
            sleeptime: 9,
            sleepquality: 9
        },
        {
            date: new Date("2021-09-17"),
            notes: "",
            sleeptime: 8,
            sleepquality: 10
        },
        {
            date: new Date("2021-09-18"),
            notes: "",
            sleeptime: 8,
            sleepquality: 9
        }
    ],
    maslows: {
        actualization: 2,
        esteem: 3,
        belongingness: 9,
        safety: 10,
        physiological: 6
    }
}
const serverUrl = process.env.REACT_APP_SERVER_URL;
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function Landing(props) {

    const [data, setData] = useState(null);
    const [startDate, setStartDate] = useState(new Date().setHours(0,0,0,0));
    const [endDate, setEndDate] = useState(new Date().setHours(0,0,0,0));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const elem1 = document.querySelectorAll('.startdatepicker');
        const options1 = {
            defaultDate: new Date(new Date().getTime() - 7 * (24 * 60 * 60 * 1000)),
            setDefaultDate: true,
            autoClose: true,
            maxDate: new Date(),
            onSelect: function(date) {
                setStartDate({ start: new Date(new Date(date).setHours(0,0,0,0))});
            }
        }
        M.Datepicker.init(elem1, options1);
        const elem2 = document.querySelectorAll('.enddatepicker');
        const options2 = {
            defaultDate: new Date(),
            setDefaultDate: true,
            autoClose: true,
            maxDate: new Date(),
            onSelect: function(date) {
                setEndDate({ start: new Date(new Date(date).setHours(0,0,0,0))});
            }
        }
        M.Datepicker.init(elem2, options2);
        setLoading(false);
        setData(mockData);
        // getData().catch(err => console.log(err))
    }, [])

    async function getData() {
        window.scrollTo(0, 0);
        axios.get(`${serverUrl}/api/datapoints`)
            .then(response => {
                setLoading(false);
                window.scrollTo(0, 0);
                setData(response.data);
            })
            .catch(err => {
                setLoading(false);
                window.scrollTo(0, 0);
                M.toast({html: 'An error has occurred. Please try again', classes: "red lighten-1"});
            })
    }

    let content;

    // If loading, render loading symbol
    if (loading || data === null) { 
        content = (<React.Fragment>
                        <i className="material-icons logo">public</i>
                        <LinearLoadingSymbol />
                        <h5 className="grey-text text-darken-2">
                            Loading...
                        </h5>
                    </React.Fragment>);
    }
    else {
        content = (
                <React.Fragment>
                    <p style={{"textAlign": "center", "marginBottom": 0, "paddingTop": "0.5rem"}}><b>Sleep</b></p>
                    <ResponsiveContainer height={300} width={500}> 
                        <LineChart data={data.timedata} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="sleeptime" stroke="#009688" name="Sleep time" />
                        <Line type="monotone" dataKey="sleepquality" stroke="#E5B522" name="Sleep quality" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <Legend verticalAlign="top" align="center" height={30} />
                        <Tooltip labelFormatter={date => `${months[date.getMonth()]} ${date.getDate()}`} formatter={(value, name, props) => {
                            if (name === "Sleep time") {
                                return [`${value} hours`, name, props];
                            }
                            else if (name === "Sleep quality") {
                                return [value, name, props];
                            }
                        }} />
                        <XAxis dataKey='date' tickFormatter={date => `${months[date.getMonth()]} ${date.getDate()}`} />
                        <YAxis dataKey="sleeptime" yAxisId={0}/>
                        <YAxis dataKey="sleepquality" yAxisId={1} orientation="right" />
                        </LineChart>
                    </ResponsiveContainer>
                    </React.Fragment>);
    }

    return (<div className="container">
                <div className="col s12 center-align header-inputs">
                    <label className="left-align datepicker">
                        Start date
                        <input type="text" class="startdatepicker"></input>
                    </label>
                    <label className="left-align datepicker">
                        End date
                        <input type="text" class="enddatepicker"></input>
                    </label>
                    <Link
                        to="/add"
                        className="add-btn btn btn-large waves-effect waves-light hoverable blue accent-3"
                        >
                            Add
                        </Link>
                </div>
                <div className="main-content valign-wrapper">
                    <div className="row">
                        <div className="col s12 center-align">
                            { content }
                        </div>
                    </div>
                </div>
            </div>);
}

export default Landing;