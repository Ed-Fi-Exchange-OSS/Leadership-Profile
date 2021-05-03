using LeadershipProfileAPI.Data.Models.ListItem;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.MeasurementSubCategories
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<ListItemSubCategory, List.SubCategoryItem>();
            CreateMap<ListItemSubCategory, Get.SubCategoryItem>();
        }
    }
}
