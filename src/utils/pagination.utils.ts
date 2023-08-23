
class PaginationUtils {

  defaultLimit = 10;  
  public getSkipCount(page?: number, limit?: number): number {
    let skip = 0;

    if (page) {
      skip = page - 1;

      if (limit) {
        skip *= limit;
      } else {
        skip *= this.defaultLimit;
      }
    }

    return skip;
  }

  public getLimitCount(limit?: number): number {
    let limitPerPage = this.defaultLimit;
    if (limit) {
      limitPerPage = limit;
    }
    return limitPerPage;
  }
}

export default new PaginationUtils();
