"use client";
import { Board, Column, JobApplication } from "@/lib/models/models.type";
import { Calendar, CheckCircle2, Mic, Award, XCircle, MoreVertical, Trash2} from "lucide-react";
import { Card,CardContent,CardHeader, CardTitle } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import CreateJobApplicationDialog from "./create-job-dialog";
import JobApplicaation from "@/lib/models/job-applicaation";
import JobApplicaationCard from "./job-application-card";

interface KanbanBoardProps{
    board: Board;
    userId: string;
}
interface ColConfig {
   color: string;
   icon: React.ReactNode 
}

const COLUMN_CONFIG: Array<ColConfig> = [
  { color: "#06b6d4",  icon: <Calendar className="h-4 w-4" /> },
  { color: "#a855f7", icon: <CheckCircle2 className="h-4 w-4" /> },
  { color:"#22c55e",  icon: <Mic className="h-4 w-4" /> },
  { color: "#eab308", icon: <Award className="h-4 w-4" /> },
  { color: "#ef4444",    icon: <XCircle className="h-4 w-4" /> },
];
function DroppableColumn({
    column,
    config,
    boardId,
    sortedColumns,
}:{
    column: Column;
    config: ColConfig;
    boardId: string;
    sortedColumns:Column[],
}){
    const sortedJobs =
     column.jobApplications?.sort((a,b) => a.order - b.order) || [];
   return (
    <Card className="min-w-[300px] flex-shrink-0 shadow-md p-0">
    <CardHeader style={{ backgroundColor: config.color }} className="text-white rounded-t-lg pb-3 pt-3"
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                {config.icon}
                <CardTitle className="text-white text-base font-semibold">
                    {column.name}
                </CardTitle>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white hover:bg-white/20">
                        <MoreVertical className="h-4 w-4"></MoreVertical>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4"></Trash2> Delete Column
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
    </CardHeader>
    <CardContent className="space-y-2 pt-4 bg-gray-50/50 min-h-[400px] rounded-b-lg">
    {sortedJobs.map((job,key) => (
         <SortableJobCard 
        key={key} 
        job={{...job,columnId: job.columnId || column._id}}
        columns={sortedColumns}
        />

    ))}
    <CreateJobApplicationDialog
    columnId = {column._id}
    boardId = {boardId} />
    </CardContent>
    </Card>
   )
}
function SortableJobCard({
    job,
    columns,
}:{
    job:JobApplication;
     columns:Column[];
    }) {
    return (
        <div>
        <JobApplicaationCard job={job} columns={columns} />
    </div>
    )
}
export default function KanbanBoard({board, userId}: KanbanBoardProps){
    const columns = board.columns;
    const sortedColumns = columns?.sort((a,b) => a.order - b.order) || [];
    return (
        <>
    <div className="space-y-4">
        <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((col,key) => {
                const config = COLUMN_CONFIG[key] || {
                    color: "bg-blue-500",
                    icon: <Calendar className="h-4 w-4"></Calendar>,
                };
                return (
                    <DroppableColumn
                        key= {key}
                        column = {col}
                        config = {config}
                        boardId = {board._id}
                        sortedColumns={sortedColumns}
                    />
                );
            })}
        </div>
    </div>
    </>
    );
}