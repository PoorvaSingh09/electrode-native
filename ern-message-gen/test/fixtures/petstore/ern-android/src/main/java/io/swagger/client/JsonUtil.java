/**
 * Swagger Petstore
 * This is a sample server Petstore server.  You can find out more about Swagger at &lt;a href&#61;&quot;http://swagger.io&quot;&gt;http://swagger.io&lt;/a&gt; or on irc.freenode.net, #swagger.  For this sample, you can use the api key &quot;special-key&quot; to test the authorization filters
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.swagger.client;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.List;
import com.walmartlabs.ern.model.*;

public class JsonUtil {
  public static GsonBuilder gsonBuilder;

  static {
    gsonBuilder = new GsonBuilder();
    gsonBuilder.serializeNulls();
    gsonBuilder.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
  }

  public static Gson getGson() {
    return gsonBuilder.create();
  }

  public static String serialize(Object obj){
    return getGson().toJson(obj);
  }

  public static <T> T deserializeToList(String jsonString, Class cls){
    return getGson().fromJson(jsonString, getListTypeForDeserialization(cls));
  }

  public static <T> T deserializeToObject(String jsonString, Class cls){
    return getGson().fromJson(jsonString, getTypeForDeserialization(cls));
  }

  public static Type getListTypeForDeserialization(Class cls) {
    String className = cls.getSimpleName();
    if ("Category".equalsIgnoreCase(className)) {
      return new TypeToken<List<Category>>(){}.getType();
    }
    if ("Order".equalsIgnoreCase(className)) {
      return new TypeToken<List<Order>>(){}.getType();
    }
    if ("Pet".equalsIgnoreCase(className)) {
      return new TypeToken<List<Pet>>(){}.getType();
    }
    if ("Tag".equalsIgnoreCase(className)) {
      return new TypeToken<List<Tag>>(){}.getType();
    }
    if ("User".equalsIgnoreCase(className)) {
      return new TypeToken<List<User>>(){}.getType();
    }
    return new TypeToken<List<Object>>(){}.getType();
  }

  public static Type getTypeForDeserialization(Class cls) {
    String className = cls.getSimpleName();
    if ("Category".equalsIgnoreCase(className)) {
      return new TypeToken<Category>(){}.getType();
    }
    if ("Order".equalsIgnoreCase(className)) {
      return new TypeToken<Order>(){}.getType();
    }
    if ("Pet".equalsIgnoreCase(className)) {
      return new TypeToken<Pet>(){}.getType();
    }
    if ("Tag".equalsIgnoreCase(className)) {
      return new TypeToken<Tag>(){}.getType();
    }
    if ("User".equalsIgnoreCase(className)) {
      return new TypeToken<User>(){}.getType();
    }
    return new TypeToken<Object>(){}.getType();
  }

};
