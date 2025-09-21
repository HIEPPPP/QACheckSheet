using AutoMapper;
using QACheckSheetAPI.Models.Domain;
using QACheckSheetAPI.Models.DTO.Sheet;
using QACheckSheetAPI.Repositories.Interface;

namespace QACheckSheetAPI.Services
{
    public class SheetServices
    {
        private readonly ISheetRepository sheetRepository;
        private readonly IMapper mapper;

        public SheetServices(ISheetRepository sheetRepository, IMapper mapper)
        {
            this.sheetRepository = sheetRepository;
            this.mapper = mapper;
        }

        public async Task<List<SheetDTO>> GetListSheet()
        {
            var listSheet = await sheetRepository.GetListAsync();
            return mapper.Map<List<SheetDTO>>(listSheet);
        }

        public async Task<SheetDTO> GetSheetById(int id)
        {
            var sheet = await sheetRepository.GetAsync(id);
            return mapper.Map<SheetDTO>(sheet);
        }

        public async Task<SheetDTO> GetSheetBycode(string sheetCode)
        {
            var sheet = await sheetRepository.GetByCodeAsync(sheetCode);
            return mapper.Map<SheetDTO>(sheet);
        }

        public async Task<SheetDTO> CreateSheet (CreateSheetRequestDTO dto)
        {
            //if (await sheetRepository.IsSheetCodeExistAsync(dto.SheetCode))
            //    throw new Exception("SheetCode đã tồn tại");

            var sheetDomain = mapper.Map<SheetMST>(dto);
            var created = await sheetRepository.CreateAsync(sheetDomain);
            return mapper.Map<SheetDTO>(created);
        }

        public async Task<SheetDTO> UpdateSheet(int id, UpdateSheetRequestDTO dto)
        {
            var sheet = await sheetRepository.GetAsync(id)
                ?? throw new Exception("Sheet không tồn tại");

            sheet.UpdateAt = DateTime.Now;
            if(!string.IsNullOrWhiteSpace(dto.SheetName))
                sheet.SheetName = dto.SheetName;
            if(!string.IsNullOrWhiteSpace(dto.FormNO))
                sheet.FormNO = dto.FormNO;
            //if(!string.IsNullOrWhiteSpace(dto.Description))
                sheet.Description = dto.Description;
            if(!string.IsNullOrEmpty(dto.UpdateBy))
                sheet.UpdateBy = dto.UpdateBy;

            await sheetRepository.UpdateAsync(sheet);
            return mapper.Map<SheetDTO>(sheet);           
        }

        public async Task DeleteSheet(int id)
        {
            var sheet = await sheetRepository.GetAsync(id)
                ?? throw new Exception("Sheet không tồn tại");
            await sheetRepository.DeleteAsync(sheet);
        }

    }
}
