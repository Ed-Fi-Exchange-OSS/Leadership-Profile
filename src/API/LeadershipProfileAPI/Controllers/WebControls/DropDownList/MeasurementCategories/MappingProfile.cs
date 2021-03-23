using LeadershipProfileAPI.Data.Models.ListItem;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.MeasurementCategories
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<ListItemCategory, List.Category>();
        }
    }
}
