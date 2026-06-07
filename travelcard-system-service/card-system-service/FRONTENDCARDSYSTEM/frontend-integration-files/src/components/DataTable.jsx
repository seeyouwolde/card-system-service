import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

/**
 * Reusable data table with built-in search and pagination.
 *
 * @param {object}   props
 * @param {object[]} props.columns  - [{ id, label, minWidth?, align?, render? }]
 * @param {object[]} props.rows     - Raw data rows (must have a unique `id` field or index)
 * @param {string[]} [props.searchableFields]  - Which row fields to search against
 * @param {string}   [props.emptyMessage]      - Shown when no rows
 * @param {boolean}  [props.loading]
 */
export default function DataTable({
  columns,
  rows,
  searchableFields = [],
  emptyMessage = 'No records found.',
  loading = false,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  // Filter rows by search query
  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) =>
      searchableFields.some((field) => {
        const val = String(row[field] ?? '').toLowerCase();
        return val.includes(q);
      })
    );
  }, [rows, search, searchableFields]);

  // Paginate
  const paginated = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  // Reset to page 0 when search changes
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  return (
    <Box>
      {/* Search bar */}
      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search…"
          value={search}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 280 } }}
        />
      </Box>

      <Paper
        variant="outlined"
        sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}
      >
        <TableContainer>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    align={col.align || 'left'}
                    sx={{
                      fontWeight: 700,
                      minWidth: col.minWidth,
                      backgroundColor: 'background.paper',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'text.secondary',
                      borderBottom: '2px solid',
                      borderColor: 'divider',
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Loading…
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((row, idx) => (
                  <TableRow
                    key={row.id ?? idx}
                    hover
                    sx={{
                      '&:last-child td': { border: 0 },
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        align={col.align || 'left'}
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {col.render ? col.render(row[col.id], row) : row[col.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        />
      </Paper>
    </Box>
  );
}
