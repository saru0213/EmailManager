"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SendLogTable({ logs = [], loading }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

 

  const processedLogs = useMemo(() => {
    const filtered = logs.filter((log) => {
      const toText = Array.isArray(log.to) ? log.to.join(", ") : log.to;

      const matchesSearch =
        !searchQuery ||
        toText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.templateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.groupName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || log.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      const aTime = a.sentAt?.seconds || 0;
      const bTime = b.sentAt?.seconds || 0;
      return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
    });

    return filtered;
  }, [logs, searchQuery, statusFilter, sortOrder]);


  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading send history...</p>
    );
  }

  if (!logs.length) {
    return <p className="text-sm text-muted-foreground">No emails sent yet.</p>;
  }


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-black text-lg sm:text-xl">
          Email Send History
        </CardTitle>

        {/* Filters */}
        <div className="flex flex-col gap-3 mt-4 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-black"
            />
          </div>

      
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

    
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="sm:w-44">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Recent first</SelectItem>
              <SelectItem value="asc">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
       
        <div className="space-y-3 sm:hidden">
          {processedLogs.map((log) => (
            <div key={log.id} className="border rounded-lg p-3 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium truncate">
                  {log.subject}
                </span>
                <Badge
                  variant={log.status === "sent" ? "default" : "destructive"}
                >
                  {log.status}
                </Badge>
              </div>

              <p className="text-xs text-gray-600 truncate">
                To: {Array.isArray(log.to) ? log.to.join(", ") : log.to}
              </p>

              <p className="text-xs text-gray-600">
                Template: {log.templateName || "—"}
              </p>

              {/* <p className="text-xs text-gray-600">
                Group: {log.groupName || "—"}
              </p> */}

              <p className="text-xs text-gray-500">
                {log.sentAt?.toDate
                  ? log.sentAt.toDate().toLocaleString()
                  : "—"}
              </p>
            </div>
          ))}
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "To",
                  "Subject",
                  "Template",
                 
                  "Status",
                  "Sent At",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {processedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm truncate max-w-xs">
                    {Array.isArray(log.to) ? log.to.join(", ") : log.to}
                  </td>

                  <td className="px-4 py-3 text-sm truncate max-w-xs">
                    {log.subject}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {log.templateName || "—"}
                  </td>
{/* 
                  <td className="px-4 py-3 text-sm">{log.groupName || "—"}</td> */}

                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        log.status === "sent" ? "default" : "destructive"
                      }
                    >
                      {log.status}
                    </Badge>
                  </td>

                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {log.sentAt?.toDate
                      ? log.sentAt.toDate().toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Showing {processedLogs.length} of {logs.length} emails
        </p>
      </CardContent>
    </Card>
  );
}
