import React from "react";
import ReportTable from "./components/ReportTable";
import ReportSheet from "./components/ReportSheet";

const ReportPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <ReportTable />
            <ReportSheet />
        </div>
    );
};

export default ReportPage;
