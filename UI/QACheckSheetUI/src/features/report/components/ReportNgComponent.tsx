import React from "react";
import type { ReportNG } from "../types/report";

type ReportNgComponentProps = {
    reportNG?: ReportNG[] | null;
};

const ReportNgComponent: React.FC<ReportNgComponentProps> = ({ reportNG }) => {
    return (
        <div className="mt-4 overflow-auto border-collapse border-gray-600">
            <table className="w-full table-fixed border-collapse text-[12px]">
                <colgroup>
                    <col style={{ width: "32px" }} />
                    <col style={{ width: "80px" }} />
                    <col style={{ width: "256px" }} />
                    <col style={{ width: "352px" }} />
                    <col style={{ width: "80px" }} />
                    <col style={{ width: "96px" }} />
                    <col style={{ width: "80px" }} />
                </colgroup>
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-1 w-1">No</th>
                        <th className="border p-1 w-14">Ngày</th>
                        <th className="border p-1">Nội dung bất thường</th>
                        <th className="border p-1">Nội dung xử lý</th>
                        <th className="border p-1 w-24">Kết quả</th>
                        <th className="border p-1 w-20">Thực hiện</th>
                        <th className="border p-1 w-24">Xác nhận</th>
                    </tr>
                </thead>
                <tbody>
                    {reportNG?.map((r, i) => (
                        <tr
                            key={i}
                            className="even:bg-white odd:bg-gray-50 hover:bg-gray-200"
                        >
                            <td className="border p-1 text-center">{i + 1}</td>
                            <td className="border p-1">
                                {String(r?.checkedDate).toString().slice(0, 10)}
                            </td>
                            <td className="border p-1">
                                <span className="">{r?.pathTitles}</span>
                                <span className="text-indigo-600 font-semibold">
                                    {r.ngContentDetail
                                        ? " (" + r.ngContentDetail + ")"
                                        : ""}
                                </span>
                            </td>

                            <td className="border p-1">{r.fixContent}</td>
                            <td className="border p-1">
                                {r.status?.toString().slice(0, 10)}
                            </td>

                            <td className="border p-1">{r.fixedBy}</td>
                            <td className="border p-1">{r.confirmedBy}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportNgComponent;
