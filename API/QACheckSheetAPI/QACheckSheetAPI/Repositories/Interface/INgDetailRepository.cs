using QACheckSheetAPI.Models.Domain;

namespace QACheckSheetAPI.Repositories.Interface
{
    public interface INgDetailRepository
    {
        Task<List<NGDetail>> GetListNgDetailAsync();
        Task<NGDetail> CreateAsync(NGDetail nGDetail);
        Task<NGDetail> UpdateAsync(NGDetail nGDetail);
    }
}
