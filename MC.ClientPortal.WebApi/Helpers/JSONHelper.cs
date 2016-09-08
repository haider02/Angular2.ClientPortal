using System.Web.Script.Serialization;

namespace MC.ClientPortal.WebApi.Helpers
{
    public static class JSONHelper
    {
        /// <summary>
        /// Extened method of object class, Converts an object to a json string.
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string ToJSON(this object obj)
        {
            var serializer = new JavaScriptSerializer();
            return serializer.Serialize(obj);            
        }
    }
}