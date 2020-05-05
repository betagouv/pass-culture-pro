import React from 'react'
import { useTable } from 'react-table'

function Table({ columns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  })

  return (
    <table
      className="bookings-table"
      {...getTableProps()}
    >
      <thead>
        {headerGroups.map(headerGroup => (
          <tr
            key={headerGroup.id}
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map(column => (
              <th
                key={column.id}
                {...column.getHeaderProps()}
              >
                {column.render('headerTitle')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr
              key={row.id}
              {...row.getRowProps()}
            >
              {row.cells.map(cell => {
                return (
                  <td
                    key={cell.id}
                    {...cell.getCellProps({ className: cell.column.className })}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Table