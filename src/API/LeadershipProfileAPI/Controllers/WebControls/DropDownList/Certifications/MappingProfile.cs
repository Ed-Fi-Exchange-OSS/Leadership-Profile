using LeadershipProfileAPI.Data.Models.ListItem;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.Certifications
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<ListItemCertification, List.Certification>();
        }
    }
}
