// src/components/ReportEvnComponent.tsx
import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { ReportData } from "../types/report";

type Row = { content: string; [k: string]: string | null | undefined };

function rowToArrays(row?: Row) {
    const nums: (number | null)[] = [];
    const texts: (string | null)[] = [];
    for (let i = 1; i <= 31; i++) {
        const v = row ? row[`day${i}`] : undefined;
        if (v === null || v === undefined || v === "") {
            nums.push(null);
            texts.push(null);
        } else {
            const parsed = Number(String(v).replace(",", "."));
            if (!Number.isFinite(parsed)) {
                nums.push(null);
                texts.push(String(v));
            } else {
                nums.push(parsed);
                texts.push(String(v));
            }
        }
    }
    return { nums, texts };
}

type Props = {
    rows?: ReportData[] | null;
};

/**
 * ReportEvnComponent
 * - Dùng Highcharts để vẽ 2 biểu đồ: Nhiệt độ & Độ ẩm
 * - Nhãn X hiển thị 2 dòng: số ngày (1..31) và giá trị tương ứng (nếu có)
 * - Giá trị null => gap (không nối)
 */
const ReportEvnComponent: React.FC<Props> = ({ rows = [] }) => {
    // tìm row nhiệt độ & độ ẩm (dựa trên content)
    const tempRow = rows?.find((r) =>
        String(r.content).toLowerCase().includes("nhiệt độ")
    ) as Row | undefined;
    const humRow = rows?.find((r) =>
        String(r.content).toLowerCase().includes("độ ẩm")
    ) as Row | undefined;

    const categories = Array.from({ length: 31 }, (_, i) => String(i + 1));

    const { nums: tempNums, texts: tempTexts } = rowToArrays(tempRow);
    const { nums: humNums, texts: humTexts } = rowToArrays(humRow);

    // TEMP options, dùng xAxis.labels.useHTML để hiển thị 2 dòng (ngày + giá trị nhỏ)
    const tempOptions = useMemo<Highcharts.Options>(() => {
        return {
            chart: {
                type: "line",
                backgroundColor: "transparent",
                spacingTop: 10,
                spacingBottom: 90, // chừa chỗ cho label HTML 2 dòng
            },
            title: { text: undefined },
            xAxis: {
                categories,
                tickInterval: 1,
                labels: {
                    useHTML: true,
                    formatter: function () {
                        // this.pos là index (0..30), this.value là ngày
                        // @ts-ignore - highcharts formatter context
                        const idx = (this as any).pos as number;
                        const extra =
                            tempTexts && tempTexts[idx] ? tempTexts[idx] : "";
                        // return HTML: ngày trên, giá trị nhỏ dưới
                        return `<div style="text-align:center;line-height:1;">
                      <div style="font-size:12px;color:#333">${this.value}</div>
                      <div style="font-size:11px;color:#666;margin-top:6px">${
                          extra ?? ""
                      }</div>
                    </div>`;
                    },
                },
                gridLineWidth: 1,
                gridLineColor: "rgba(0,0,0,0.06)",
            },
            yAxis: {
                title: { text: undefined },
                min: 10,
                max: 35,
                tickInterval: 1,
                gridLineWidth: 1,
                gridLineColor: "rgba(0,0,0,0.06)",
                plotBands: [
                    {
                        from: 20,
                        to: 30,
                        color: "rgba(200,230,255,0.2)",
                        zIndex: 0,
                    },
                ],
            },
            tooltip: {
                shared: false,
                formatter: function () {
                    if (
                        (this as any).y === null ||
                        (this as any).y === undefined
                    )
                        return "—";
                    return `${(this as any).series.name}: ${(this as any).y}`;
                },
            },
            plotOptions: {
                series: {
                    connectNulls: false, // gap nếu null
                    marker: { enabled: true, radius: 3 },
                    lineWidth: 1.5,
                },
            },
            series: [
                {
                    name: "Nhiệt độ (°C)",
                    type: "line",
                    data: tempNums.map((v) => (v === null ? null : v)),
                } as Highcharts.SeriesLineOptions,
            ],
            credits: { enabled: false },
            legend: { enabled: false },
        };
        // tempTexts.join(',') để trigger recreation khi text thay đổi
    }, [categories.join(","), tempNums.join(","), tempTexts.join(",")]);

    // HUM options, tương tự
    const humOptions = useMemo<Highcharts.Options>(() => {
        return {
            chart: {
                type: "line",
                backgroundColor: "transparent",
                spacingTop: 10,
                spacingBottom: 90,
            },
            title: { text: undefined },
            xAxis: {
                categories,
                tickInterval: 1,
                labels: {
                    useHTML: true,
                    formatter: function () {
                        // @ts-ignore
                        const idx = (this as any).pos as number;
                        const extra =
                            humTexts && humTexts[idx] ? humTexts[idx] : "";
                        return `<div style="text-align:center;line-height:1;">
                      <div style="font-size:12px;color:#333">${this.value}</div>
                      <div style="font-size:11px;color:#666;margin-top:6px">${
                          extra ?? ""
                      }</div>
                    </div>`;
                    },
                },
                gridLineWidth: 1,
                gridLineColor: "rgba(0,0,0,0.06)",
            },
            yAxis: {
                title: { text: undefined },
                min: 0,
                max: 100,
                tickInterval: 5,
                gridLineWidth: 1,
                gridLineColor: "rgba(0,0,0,0.06)",
                plotBands: [
                    {
                        from: 20,
                        to: 70,
                        color: "rgba(220,255,220,0.12)",
                        zIndex: 0,
                    },
                ],
            },
            tooltip: {
                shared: false,
                formatter: function () {
                    if (
                        (this as any).y === null ||
                        (this as any).y === undefined
                    )
                        return "—";
                    return `${(this as any).series.name}: ${(this as any).y}`;
                },
            },
            plotOptions: {
                series: {
                    connectNulls: false,
                    marker: { enabled: true, radius: 3 },
                    lineWidth: 1.5,
                },
            },
            series: [
                {
                    name: "Độ ẩm (%)",
                    type: "line",
                    data: humNums.map((v) => (v === null ? null : v)),
                } as Highcharts.SeriesLineOptions,
            ],
            credits: { enabled: false },
            legend: { enabled: false },
        };
    }, [categories.join(","), humNums.join(","), humTexts.join(",")]);

    return (
        <div
            style={{
                margin: "20px 0",
                fontFamily: "Inter, Roboto, Arial, sans-serif",
            }}
        >
            <div
                style={{
                    background: "white",
                    borderRadius: 6,
                    padding: 10,
                    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                    marginBottom: 18,
                }}
            >
                <h4 style={{ margin: "6px 0 10px" }}>
                    Nhiệt độ (°C) — tiêu chuẩn: 20°C đến 30°C
                </h4>
                <div
                    className="grid-paper"
                    style={{
                        padding: 6,
                        backgroundImage:
                            "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                        border: "1px solid rgba(0,0,0,0.06)",
                        borderRadius: 4,
                    }}
                >
                    <div style={{ height: 300 }}>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={tempOptions}
                        />
                    </div>
                </div>
            </div>

            <div
                style={{
                    background: "white",
                    borderRadius: 6,
                    padding: 10,
                    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                }}
            >
                <h4 style={{ margin: "6px 0 10px" }}>
                    Độ ẩm (%) — tiêu chuẩn: 20% đến 70%
                </h4>
                <div
                    className="grid-paper"
                    style={{
                        padding: 6,
                        backgroundImage:
                            "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                        border: "1px solid rgba(0,0,0,0.06)",
                        borderRadius: 4,
                    }}
                >
                    <div style={{ height: 300 }}>
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={humOptions}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportEvnComponent;
