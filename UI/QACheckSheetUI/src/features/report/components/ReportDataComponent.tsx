// ReportDataHier.tsx (updated - smaller font, uniform borders, no dashed split)
import React, { useMemo } from "react";
import type { ReportData } from "../types/report";

type Props = {
    rows?: ReportData[] | null;
    days?: number; // default 31
    leftLevelWidths?: number[]; // widths in px for left-level columns
    showTimeRowInBody?: boolean;
};

const getDayKey = (i: number) => `day${i}`;
const txt = (v: any) =>
    v === null || v === undefined || String(v).trim() === "" ? "" : String(v);

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

const ReportDataComponent: React.FC<Props> = ({
    rows = [],
    days = 31,
    leftLevelWidths = [360, 220, 200],
    showTimeRowInBody = false,
}) => {
    const normalized = useMemo(() => (rows ?? []).slice(), [rows]);

    // parse content -> parts by '>'
    const parsed = useMemo(
        () =>
            normalized.map((r) => {
                const content = (r.content ?? "") as string;
                const parts = content
                    .split(">")
                    .map((p) => p.trim())
                    .filter((p) => p.length > 0);
                return { raw: r, parts };
            }),
        [normalized]
    );

    const maxLevels = useMemo(
        () => Math.max(1, ...parsed.map((p) => p.parts.length)),
        [parsed]
    );

    // expand widths to match maxLevels
    const leftWidths = useMemo(() => {
        const res: number[] = [];
        for (let i = 0; i < maxLevels; i++) {
            res.push(
                leftLevelWidths[i] ??
                    leftLevelWidths[leftLevelWidths.length - 1]
            );
        }
        return res;
    }, [maxLevels, leftLevelWidths]);

    // find time row
    const timeRowIndex = parsed.findIndex(
        (p) =>
            (p.raw.content ?? "").toString().trim().toLowerCase() ===
            "giờ kiểm tra"
    );
    const timeRow = timeRowIndex >= 0 ? parsed[timeRowIndex].raw : null;

    const headerTimes = Array.from({ length: days }, (_, i) => {
        const key = getDayKey(i + 1);
        return timeRow ? timeRow[key] ?? "" : "";
    });

    const bodyParsed = useMemo(() => {
        return parsed.filter((_, idx) => {
            if (timeRowIndex === -1) return true;
            if (showTimeRowInBody) return true;
            return idx !== timeRowIndex;
        });
    }, [parsed, timeRowIndex, showTimeRowInBody]);

    const dayNumbers = Array.from({ length: days }, (_, i) => i + 1);

    // sticky left offsets
    const leftOffsets = useMemo(() => {
        const offsets: number[] = [];
        let acc = 0;
        for (let i = 0; i < leftWidths.length; i++) {
            offsets.push(acc);
            acc += leftWidths[i];
        }
        return offsets;
    }, [leftWidths]);

    const leftTotal = sum(leftWidths);

    return (
        <div className="mt-4 border border-gray-300 overflow-auto">
            <table
                className="table-fixed border-collapse"
                style={{ minWidth: leftTotal + days * 72 }}
            >
                <colgroup>
                    {leftWidths.map((w, i) => (
                        <col key={`L${i}`} style={{ width: w }} />
                    ))}
                    {dayNumbers.map((d) => (
                        <col key={`D${d}`} style={{ width: 72 }} />
                    ))}
                </colgroup>

                <thead>
                    <tr>
                        <th
                            colSpan={maxLevels}
                            className="sticky left-0 z-40 bg-white border border-gray-300 p-2 text-xs text-left"
                            style={{ boxShadow: "2px 0 0 #fff" }}
                        >
                            <div className="font-semibold text-xs">
                                Nội dung kiểm tra
                            </div>
                        </th>

                        {dayNumbers.map((d) => (
                            <th
                                key={d}
                                className="border border-gray-300 p-1 text-xs text-center align-middle whitespace-nowrap"
                            >
                                {d}
                            </th>
                        ))}
                    </tr>

                    <tr>
                        <th
                            colSpan={maxLevels}
                            className="sticky left-0 z-30 bg-white border border-gray-300 p-1 text-xs text-left"
                        >
                            <div className="font-medium text-xs">Giờ</div>
                        </th>

                        {dayNumbers.map((d) => (
                            <th
                                key={d}
                                className="border border-gray-300 p-1 text-[11px] text-center align-middle whitespace-nowrap"
                                title={
                                    headerTimes[d - 1] != null
                                        ? String(headerTimes[d - 1])
                                        : undefined
                                }
                            >
                                {txt(headerTimes[d - 1])}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {bodyParsed.length === 0 && (
                        <tr>
                            <td
                                className="border border-gray-300 p-3 text-xs"
                                colSpan={maxLevels + days}
                            >
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}

                    {bodyParsed.map((p, rIdx) => {
                        const parts = p.parts;
                        const raw = p.raw;
                        const rowKey = `row-${rIdx}`;

                        return (
                            <tr key={rowKey}>
                                {/* left level sticky cells */}
                                {Array.from({ length: maxLevels }).map(
                                    (_, lvl) => {
                                        const leftStyle: React.CSSProperties = {
                                            position: "sticky",
                                            left: leftOffsets[lvl],
                                            zIndex: 20 - lvl,
                                            background: "white",
                                            borderRight:
                                                "2px solid rgba(0,0,0,0.06)",
                                        };

                                        const seg = parts[lvl] ?? "";

                                        return (
                                            <td
                                                key={`${rowKey}-L${lvl}`}
                                                className="p-1 align-top border border-gray-300 text-xs"
                                                style={leftStyle}
                                            >
                                                <div
                                                    style={{
                                                        paddingLeft: lvl * 6,
                                                        whiteSpace: "normal",
                                                        lineHeight: 1.15,
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    {seg}
                                                </div>
                                            </td>
                                        );
                                    }
                                )}

                                {dayNumbers.map((d) => {
                                    const key = getDayKey(d);
                                    const val = raw[key];
                                    return (
                                        <td
                                            key={`${rowKey}-D${d}`}
                                            className="border border-gray-300 h-[36px] p-0 text-center align-middle text-xs whitespace-nowrap"
                                            title={txt(val)}
                                        >
                                            <div className="h-full w-full flex items-center justify-center px-1">
                                                <span className="text-xs">
                                                    {txt(val)}
                                                </span>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ReportDataComponent;
