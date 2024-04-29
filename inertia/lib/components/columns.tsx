import Article from '#models/article'
import { ColumnDef } from '@tanstack/react-table'
import { DateTime } from 'luxon'

import { DataTableColumnHeader } from './data_table_column_header'
import { Checkbox } from './ui/checkbox'

export const columns: ColumnDef<Article>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Task" />,
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{row.getValue('title')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'sourceUrl',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Source URL" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{row.getValue('sourceUrl')}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      debugger
      return value.includes(row.getValue(id)) || value.includes(row.getValue('title'))
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {DateTime.fromISO(row.getValue('updatedAt')).toRelative()}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]
