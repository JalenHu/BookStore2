interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

function Pagination({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
    return (
        <div className="row align-items-center">
            <div className="col-auto">
                <nav>
                    <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                                Previous
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => onPageChange(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="col-auto ms-auto">
                <label className="form-label mb-0 me-2">Results per page:</label>
                <select
                    className="form-select form-select-sm d-inline-block w-auto"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>
        </div>
    );
}

export default Pagination;
