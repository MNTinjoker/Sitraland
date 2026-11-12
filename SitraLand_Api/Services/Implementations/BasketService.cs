using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SitraLand_Api.Data;
using SitraLand_Api.Models.BasketModels;
using SitraLand_Api.Models.Response;
using SitraLand_Api.Services.Interfaces;
using System.Net;

namespace SitraLand_Api.Services.Implementations
{
    public class BasketService : IBasketService
    {
        private readonly IMapper _mapper;
        private readonly DatabaseContext _dbContext;

        public BasketService(IMapper mapper, DatabaseContext dbContext)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public async Task<ResponseGlobal> SaveBasket(SaveBasketDTO model)
        {
            var result = new ResponseGlobal();
            try
            {
                Random generator = new Random();
                String r = generator.Next(0, 1000000).ToString("D6");
                model.BasketCode = r;
                var basket = _mapper.Map<Basket>(model);

                await _dbContext.Baskets.AddAsync(basket);
                await _dbContext.SaveChangesAsync();

                for (int i = 0; i < model.ProductId.Length; i++)
                {
                    var count = model.LastCount[i];
                    _dbContext.Products.Where(p => p.ProductId == model.ProductId[i])
                        .ExecuteUpdate(setters => setters
                        .SetProperty(x => x.Count, count));

                    await _dbContext.SaveChangesAsync();
                }
                result.Message = r;
                result.Code = 200;
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseGlobal> GetAllBasket()
        {
            var result = new ResponseGlobal();

            try
            {
                var basket = await _dbContext.Baskets.ToListAsync();

                result.Message = "success";
                result.Code = (int)HttpStatusCode.OK;
                result.Data = basket;
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<List<object>> GetBasketProducts(int[] products)
        {
            var result = new List<object>();

            try
            {
                for (int i = 0; i < products.Length; i++)
                {
                    var product = await _dbContext.Products
                          .Where(x => x.ProductId == products[i])
                            .Select(p => new
                            {
                                p.Count,
                                p.ProductDescription,
                                p.ExtraDetails,
                                p.ProductId,
                                p.ImageFolderPath,
                                p.IsActive,
                                p.ProductName,
                                p.Price,
                                p.CategoryId
                            }).ToListAsync();
                    result.Add(product);
                }
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseGlobal> GetBasket(string basketCode)
        {
            var result = new ResponseGlobal();

            try
            {
                var basket = await _dbContext.Baskets.AsNoTracking().FirstOrDefaultAsync(q => q.BasketCode == basketCode);

                result.Message = "success";
                result.Code = (int)HttpStatusCode.OK;
                result.Data = basket;
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseGlobal> UpdateBasket(int basketId, UpdateBasketDTO model)
        {
            var result = new ResponseGlobal();

            try
            {
                var basket = await _dbContext.Baskets.AsNoTracking().FirstOrDefaultAsync(q => q.BasketId == basketId);
                if (basket == null)
                {
                    result.Message = "Submitted Data Is Invalid";
                    return result;
                }

                _mapper.Map(model, basket);
                _dbContext.Baskets.Attach(basket);
                _dbContext.Baskets.Entry(basket).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();

                result.Message = "Success";
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseGlobal> DeleteBasket(int basketId)
        {
            var result = new ResponseGlobal();

            try
            {
                if (basketId < 1)
                {
                    result.Message = "Invalid Body Request";
                    return result;
                }

                var basket1 = await _dbContext.Baskets.AsNoTracking().FirstOrDefaultAsync(q => q.BasketId == basketId);
                if (basket1 == null)
                {
                    result.Message = "Submitted Data Is Invalid";
                    return result;
                }

                var basketForDelete = await _dbContext.Baskets.Where(b => b.BasketId == basketId)
                    .ExecuteDeleteAsync();
                await _dbContext.SaveChangesAsync();

                result.Message = "Success";
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ResponseGlobal> SendOrderConfirm(string basketCode)
        {
            var result = new ResponseGlobal();

            try
            {
                await _dbContext.Baskets.Where(b => b.BasketCode == basketCode)
                      .ExecuteUpdateAsync(setters => setters
                            .SetProperty(x => x.Status, 1));

                result.Message = "Confirmed Send This Order";
                result.Code = 200;
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
