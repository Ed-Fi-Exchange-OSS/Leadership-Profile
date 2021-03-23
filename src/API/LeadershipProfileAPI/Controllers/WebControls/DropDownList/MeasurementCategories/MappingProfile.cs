using LeadershipProfileAPI.Data.Models;
using LeadershipProfileAPI.Data.Models.ListItem;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeadershipProfileAPI.Controllers.WebControls.DropDownList.MeasurementCategories
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<ListItemCategory, List.Category>()
                .ForMember(dst => dst.Text, opt => opt.MapFrom(x => x.Text))
                .ForMember(dst => dst.Value, opt => opt.MapFrom(x => x.Value));
        }
    }
}
