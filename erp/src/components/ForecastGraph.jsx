import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';
import moment from 'moment';

const ForecastGraph = ({ id }) => {
    const [incomingData, setIncomingData] = useState([]);
    const [outgoingData, setOutgoingData] = useState([]);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        const fetchData = async () => {
            const planningProducts = await axios.get("/erp/production_planning");
            const planningProductsData = planningProducts.data;

            const inComing = planningProductsData
                .filter(product => product._id.toString() === id)
                .flatMap(product => {
                    let qty = 0;
                    return product.forecastInDepth.map(process => {
                        if (process.reference.includes("PRD")) {
                            qty += process.quantity;
                        }
                        return {
                            reference: process.reference,
                            date: process.date,
                            data: qty
                        };
                    });
                });

            const outGoing = planningProductsData
                .filter(product => product._id.toString() === id)
                .flatMap(product => {
                    let qty = 0;
                    return product.forecastInDepth.map(process => {
                        if (process.reference.includes("SHP")) {
                            process?.order?.orders?.map(order => qty += order.quantity);
                        }
                        return {
                            reference: process.reference,
                            date: process.scheduledDate,
                            data: qty
                        };
                    });
                });

            setIncomingData(inComing.filter(incoming => incoming.reference.includes("PRD")));
            setOutgoingData(outGoing.filter(incoming => incoming.reference.includes("SHP")));
        } 

        fetchData();
    }, [])

    const productionByMonth = (monthNumber) => {
        let data = 0;
        incomingData?.map(coming => {
            const [date, time] = coming.date.split("T");
            const [year, month, day] = date.split("-");
            if(month === monthNumber){
                data = coming.data;
            }
        })
        return data;
    }

    const shipmentByMonth = (monthNumber) => {
        let data = 0;
        outgoingData?.map(going => {
            const [date, time] = going.date.split("T");
            const [year, month, day] = date.split("-");
            if(month === monthNumber){
                data = going.data;
            }
        })
        return data;
    }

    const chartData = {
        labels: months,
        datasets: [
            {
                label: 'Incoming',
                backgroundColor: 'rgba(75, 192, 192, 0.2)', 
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: true,
                borderWidth: 2,
                tension: 0.4,
                data: [
                    productionByMonth('01'), 
                    productionByMonth('02'), 
                    productionByMonth('03'),
                    productionByMonth('04'),
                    productionByMonth('05'),
                    productionByMonth('06'),
                    productionByMonth('07'),
                    productionByMonth('08'),
                    productionByMonth('09'),
                    productionByMonth('10'),
                    productionByMonth('11'),
                    productionByMonth('12'),
                    productionByMonth('13')
                ],
            },
            {
                label: 'Outgoing',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: true,
                borderWidth: 2,
                tension: 0.4,
                data: [
                    shipmentByMonth('01'), 
                    shipmentByMonth('02'), 
                    shipmentByMonth('03'),
                    shipmentByMonth('04'),
                    shipmentByMonth('05'),
                    shipmentByMonth('06'),
                    shipmentByMonth('07'),
                    shipmentByMonth('08'),
                    shipmentByMonth('09'),
                    shipmentByMonth('10'),
                    shipmentByMonth('11'),
                    shipmentByMonth('12'),
                    shipmentByMonth('13')
                ],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className='w-full mb-4'>
            <Chart type='bar' data={chartData} options={chartOptions} />
        </div>
    );
}

export default ForecastGraph;