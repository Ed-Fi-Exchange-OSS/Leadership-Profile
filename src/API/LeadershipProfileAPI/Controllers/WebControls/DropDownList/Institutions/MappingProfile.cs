using AutoMapper;
using LeadershipProfileAPI.Data.Models.ListItem;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.Institutions
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ListItemInstitution, List.Institution>();
        }
    }
}