using LeadershipProfileAPI.Data.Models.ListItem;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.Degrees
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<ListItemDegree, List.Degree>();
        }
    }
}
