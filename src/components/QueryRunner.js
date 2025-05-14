"use client";
import {useState} from "react";
import {useDb} from "../context/DbContext";

const QueryRunner = () => {
    const db = useDb();

    const [query, setQuery] = useState(`SELECT * FROM PATIENTS`);
    const [output, setOutput] = useState(null);
    const [error, setError] = useState(null);

    // Early return if DB is not yet loaded
    if (!db) {
        return <p className="text-center">Loading database...</p>;
    }

    const runQuery = async () => {
        try {
            const result = await db.exec(query);
            setError(null);
            setOutput(result[0] || null);
        } catch (err) {
            setOutput(null);
            setError(err.message);
        }
    };
    const formatCellValue = (value) => {
        if (value instanceof Date) return value.toLocaleString();
        if (typeof value === "object" && value !== null) return JSON.stringify(value);
        return String(value);
    };

    return (
        <section className="p-4 pt-0 border rounded-lg max-w-2xl mx-auto my-4">
            <p className="text-lg font-medium py-2">Query Interface</p>
            <textarea
                rows={4}
                className="w-full border p-2 font-mono text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Write your SQL query..."
            />

            <button
                onClick={runQuery}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
            >
                Run Query
            </button>

            {error && (
                <div className="mt-3 text-red-600">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {output && (
                <div className="mt-4 overflow-x-auto text-sm">
                    <table className="table-auto border-collapse border border-gray-300 w-full">
                        <thead>
                            <tr>
                                {output.fields.map((field) => (
                                    <th key={field.name} className="border p-2 bg-gray-100">
                                        {field.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {output.rows.map((row, i) => (
                                <tr key={i}>
                                    {output.fields.map((field) => (
                                        <td key={field.name} className="border p-2">
                                            {formatCellValue(row[field.name])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default QueryRunner;
