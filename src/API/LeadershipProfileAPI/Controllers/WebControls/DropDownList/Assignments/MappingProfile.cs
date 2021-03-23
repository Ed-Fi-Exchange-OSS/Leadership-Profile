using LeadershipProfileAPI.Data.Models.ListItem;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.Assignments
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<ListItemAssignment, List.Assignment>();
        }
    }
}
