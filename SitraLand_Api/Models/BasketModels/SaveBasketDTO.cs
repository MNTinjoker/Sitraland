namespace SitraLand_Api.Models.BasketModels
{
    public class SaveBasketDTO
    {
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public long NationalCode { get; set; }
        public int[] Count { get; set; }
        public int[] ProductId { get; set; }
        public string Mobile { get; set; }
        public int Status { get; set; }
        public string? BasketCode { get; set; }
        public string? Tozihat { get; set; }
        public string Ostan { get; set; }
        public string Titles { get; set; }
        public int[] LastCount { get; set; }
        public string BasketDate { get; set; }
        public long TotalPrice { get; set; }
    }
}
