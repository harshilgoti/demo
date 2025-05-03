"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LoaderIcon, SquareCheck } from "lucide-react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";
import { HabitForm } from "./habit-form";
import { Habit } from "@/lib/types";
import { MarkAsDoneButton } from "./mark-button";
import { HabitTracker } from "./habit-tracker";

export function DataTable({ data: initialData }: { data: Habit[] | any[] }) {
  const [rowSelection, setRowSelection] = useState({});
  const [selectedHabit, setSelectedHabit] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [open, setOpen] = useState(false);
  const [openTracker, setOpenTracker] = useState(false);

  const data = useMemo(
    () => initialData.map((row) => ({ ...row, id: row._id })) || [],
    [initialData]
  );

  const handleClickHabit = (row: any) => {
    setSelectedHabit(row?._id);
    setOpenTracker(true);
  };

  const columns: ColumnDef<Habit>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "isTodayCompleted",
      header: "Completed",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
        >
          {row.original.isTodayCompleted ? (
            <SquareCheck className="text-green-500 dark:text-green-400" />
          ) : (
            <LoaderIcon />
          )}
        </Badge>
      ),
    },
    {
      accessorKey: "",
      header: "Habit Tracker By Date",
      cell: ({ row }) => (
        <Button onClick={() => handleClickHabit(row?.original)}>
          Habit Tracker
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: "Mark as done",
      cell: ({ row }) =>
        !row?.original?.isTodayCompleted ? (
          <MarkAsDoneButton id={row?.original?.id} />
        ) : null,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const dataIds = useMemo(() => data?.map(({ id }) => id) || [], [data]);

  return (
    <>
      <div
        defaultValue="outline"
        className="flex w-full flex-col justify-start gap-6"
      >
        <div className="flex items-center justify-between px-4 lg:px-6">
          <strong>Habit</strong>
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            + Add
          </Button>
        </div>
        <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row?.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {open && <HabitForm open={open} setOpen={setOpen} />}
      {openTracker && (
        <HabitTracker
          open={openTracker}
          setOpen={setOpenTracker}
          habitId={selectedHabit}
        />
      )}
    </>
  );
}
