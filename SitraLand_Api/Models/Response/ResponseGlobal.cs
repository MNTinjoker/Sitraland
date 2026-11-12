namespace SitraLand_Api.Models.Response
{
    public class ResponseGlobal
    {
        public string? Message { get; set; }
        public int Code { get; set; }
        public int? TotalCount { get; set; }
        public object? Data { get; set; }
    }
}
