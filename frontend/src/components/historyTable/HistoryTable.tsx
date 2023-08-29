import React from 'react';
import dayjs from 'dayjs';
import './style.css';
import IHistory from '../../interfaces/IHistory';

interface HistoryTableProps {
  history: IHistory[];
}

function HistoryTable({ history }: HistoryTableProps) {
  return (
    <div className="history-table">
      {history.map((e, i) => (
        <div key={e._id} className="history-table-row">
          <span className="column-index">#{i + 1}</span>
          <span className="column-date">{dayjs(e.waxing_time).format('DD-MM-YYYY')}</span>
          <span className="column-time">{dayjs(e.waxing_time).format('HH:mm')}</span>
        </div>
      ))}
    </div>
  );
}

export default HistoryTable;
