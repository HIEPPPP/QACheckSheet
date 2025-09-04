using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Services
{
    public class NgDetailServices
    {
        private readonly INgDetailRepository ngDetailRepository;

        public NgDetailServices(INgDetailRepository ngDetailRepository)
        {
            this.ngDetailRepository = ngDetailRepository;
        }

        public async Task<List<NGDetail>> GetListNgDetail()
        {
            return await ngDetailRepository.GetListNgDetailAsync();
        }
    }
}
