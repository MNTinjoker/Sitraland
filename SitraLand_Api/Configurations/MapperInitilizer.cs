using AutoMapper;
using SitraLand_Api.Data;
using SitraLand_Api.Models.BasketModels;
using SitraLand_Api.Models.CategoryModels;
using SitraLand_Api.Models.ProductsModels;
using SitraLand_Api.Models.UserModels;

namespace SitraLand_Api.Configurations
{
    public class MapperInitilizer : Profile
    {
        public MapperInitilizer()
        {
            CreateMap<Product,ProductsDTO>().ReverseMap();
            CreateMap<Product, SaveProductsDTO>().ReverseMap();
            CreateMap<ApiUser, UserDTO>().ReverseMap();
            CreateMap<Category,CategoryDTO>().ReverseMap();
            CreateMap<Category,SaveCategoryDTO>().ReverseMap();
            CreateMap<Basket,SaveBasketDTO>().ReverseMap();
            CreateMap<Basket,BasketDTO>().ReverseMap();
        }
    }
}
