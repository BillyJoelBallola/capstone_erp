import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import autoTable from 'jspdf-autotable';
import moment from "moment";
import jsPDF from "jspdf";

const ReportTable = ({ dataValue, columns, name, setAction }) => {
    const navigate = useNavigate();
    const op = useParams().op;
    const dt = useRef(null);
    const formattedName = name.toLowerCase().split(" ").join("-");

    const exportHead = columns.map(col => {
        let head = [];
        if(col.header !== ""){
            head.push(col.header);
        }
        head.map(header => {
            if(header === undefined){
                head.pop(header);
            }
        })
        return head.flat();
    }).filter(arr => arr.length > 0);

    const exportBody = dataValue.map(data => {
        return [data.name, data.price, data.quantity, data.forecast.inComing, data.forecast.outGoing];
    });
    
    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '-inventory-report-' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = async () => {
        const doc = new jsPDF();
        doc.text("Inventory Report", 15, 10);
        doc.text(moment(Date.now()).format("LL"), 150, 10);
        autoTable(doc, {
            head: [exportHead],
            body: exportBody,
            text: "Inventory"
        });
        doc.save(`${op}-inventory-report-${Date.now()}.pdf`);
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(dataValue);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, op);
        });
    };
    
    return (
        <>
            <div className="pt-14 px-4 flex gap-3 items-center justify-between py-3 border border-t-0 border-b-gray-200 bg-white">
                <span className='text-lg font-semibold'>{name} Report</span>
                <div className='flex gap-4 items-center w-1/3'>
                    <select onChange={(e) => navigate(`/inventory/inventory_report/${e.target.value}`)}>
                        <option value="products">Products</option>
                        <option value="raw-materials">Raw Materials</option>
                    </select>
                    <div className="flex align-items-center justify-content-end gap-1">
                        <button className='bg-violet-500 p-3 rounded-full hover:bg-violet-600 duration-150' onClick={() => exportCSV(false)}>
                            <svg fill="#fff" viewBox="0 0 16 16" className='w-4 h-4'>
                                <path fillRule="evenodd" d="M14 4.5V14a2 2 0 01-2 2h-1v-1h1a1 1 0 001-1V4.5h-2A1.5 1.5 0 019.5 3V1H4a1 1 0 00-1 1v9H2V2a2 2 0 012-2h5.5L14 4.5zM3.517 14.841a1.13 1.13 0 00.401.823c.13.108.289.192.478.252.19.061.411.091.665.091.338 0 .624-.053.859-.158.236-.105.416-.252.539-.44.125-.189.187-.408.187-.656 0-.224-.045-.41-.134-.56a1.001 1.001 0 00-.375-.357 2.027 2.027 0 00-.566-.21l-.621-.144a.97.97 0 01-.404-.176.37.37 0 01-.144-.299c0-.156.062-.284.185-.384.125-.101.296-.152.512-.152.143 0 .266.023.37.068a.624.624 0 01.246.181.56.56 0 01.12.258h.75a1.092 1.092 0 00-.2-.566 1.21 1.21 0 00-.5-.41 1.813 1.813 0 00-.78-.152c-.293 0-.551.05-.776.15-.225.099-.4.24-.527.421-.127.182-.19.395-.19.639 0 .201.04.376.122.524.082.149.2.27.352.367.152.095.332.167.539.213l.618.144c.207.049.361.113.463.193a.387.387 0 01.152.326.505.505 0 01-.085.29.559.559 0 01-.255.193c-.111.047-.249.07-.413.07-.117 0-.223-.013-.32-.04a.838.838 0 01-.248-.115.578.578 0 01-.255-.384h-.765zM.806 13.693c0-.248.034-.46.102-.633a.868.868 0 01.302-.399.814.814 0 01.475-.137c.15 0 .283.032.398.097a.7.7 0 01.272.26.85.85 0 01.12.381h.765v-.072a1.33 1.33 0 00-.466-.964 1.441 1.441 0 00-.489-.272 1.838 1.838 0 00-.606-.097c-.356 0-.66.074-.911.223-.25.148-.44.359-.572.632-.13.274-.196.6-.196.979v.498c0 .379.064.704.193.976.131.271.322.48.572.626.25.145.554.217.914.217.293 0 .554-.055.785-.164.23-.11.414-.26.55-.454a1.27 1.27 0 00.226-.674v-.076h-.764a.799.799 0 01-.118.363.7.7 0 01-.272.25.874.874 0 01-.401.087.845.845 0 01-.478-.132.833.833 0 01-.299-.392 1.699 1.699 0 01-.102-.627v-.495zm8.239 2.238h-.953l-1.338-3.999h.917l.896 3.138h.038l.888-3.138h.879l-1.327 4z" />
                            </svg>
                        </button>
                        <button className='bg-green-500 p-3 rounded-full hover:bg-green-600 duration-150' onClick={exportExcel}>
                            <svg fill="#fff" viewBox="0 0 16 16" className='w-4 h-4'>
                                <path d="M5.884 6.68a.5.5 0 10-.768.64L7.349 10l-2.233 2.68a.5.5 0 00.768.64L8 10.781l2.116 2.54a.5.5 0 00.768-.641L8.651 10l2.233-2.68a.5.5 0 00-.768-.64L8 9.219l-2.116-2.54z" />
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2zM9.5 3A1.5 1.5 0 0011 4.5h2V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1h5.5v2z" />
                            </svg>
                        </button>
                        <button className='bg-yellow-500 p-3 rounded-full hover:bg-yellow-600 duration-150' onClick={exportPdf}>
                            <svg fill="#fff" viewBox="0 0 16 16" className='w-4 h-4' >
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2zM9.5 3A1.5 1.5 0 0011 4.5h2V14a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1h5.5v2z" />
                                <path d="M4.603 14.087a.81.81 0 01-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 011.482-.645 19.697 19.697 0 001.062-2.227 7.269 7.269 0 01-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 01.477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 00.98 1.686 5.753 5.753 0 011.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 01-.354.416.856.856 0 01-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 01-.911-.95 11.651 11.651 0 00-1.997.406 11.307 11.307 0 01-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 01-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 00.035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 00.45-.606zm1.64-1.33a12.71 12.71 0 011.01-.193 11.744 11.744 0 01-.51-.858 20.801 20.801 0 01-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 00.07-.015.307.307 0 00.094-.125.436.436 0 00.059-.2.095.095 0 00-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 00-.612-.053zM8.078 7.8a6.7 6.7 0 00.2-.828c.031-.188.043-.343.038-.465a.613.613 0 00-.032-.198.517.517 0 00-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <DataTable
                ref={dt}
                stripedRows 
                paginator
                rows={10} 
                paginatorTemplate={"PrevPageLink CurrentPageReport NextPageLink"}
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                dataKey='_id'
                value={dataValue}
                tableStyle={{ minWidth: "40rem" }}
            >
                {columns.map((item, idx) => (
                    <Column 
                        field={item.field}
                        header={item.header}
                        key={idx}
                    />    
                ))}
            </DataTable>    
        </>
    )
}

export default ReportTable;