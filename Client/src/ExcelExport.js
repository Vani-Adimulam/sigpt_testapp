import React, { useState } from 'react';
import { utils, writeFile } from 'xlsx';

const ExcelExport = ({ data }) => {
    const [isExporting, setIsExporting] = useState(false);
    const exportData = async () => {
        setIsExporting(true);

        const wb = utils.book_new();
        const RequireData=await data.map((item)=>{
            return {
                Name:item.name,
                Email:item.email,
                Area:item.area,
                TestStatus:item.testStatus,
                Score:`${item.totalScore || "" }/${item.total || ""}`,
                Result:item.result
            }
        })
        const ws = utils.json_to_sheet(RequireData);
        utils.book_append_sheet(wb, ws, 'Sheet 1');

        await writeFile(wb, 'data.xlsx');
        setIsExporting(false);
    };

    const handleExport = () => {
        if (!isExporting) {
            exportData();
        }
    };

    return (
        <div>
            <button  className="btn" style={ {backgroundColor: "#0CCF4F", fontFamily: "fantasy",marginBottom:"5px",color:"#DDE2E8"}} onClick={handleExport}>Export to Excel</button>
        </div>
    );
};

export default ExcelExport;